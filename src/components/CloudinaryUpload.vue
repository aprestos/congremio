<template>
  <div>
    <button
      type="button"
      @click="openCloudinaryWidget"
      :disabled="isUploading"
      class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="!isUploading">{{ buttonText }}</span>
      <span v-else class="flex items-center gap-2">
        <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ uploadingText }}
      </span>
    </button>
    <p class="mt-2 text-xs/5 text-gray-500 dark:text-gray-400">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { tenantStore } from "@/stores/tenant";

// Props
interface Props {
  modelValue?: string;
  folder: string;
  publicIdPrefix?: string;
  buttonText?: string;
  uploadingText?: string;
  helperText?: string;
  altText?: string;
  aspectRatio?: number;
  maxFileSize?: number;
  allowedFormats?: string[];
  tags?: string[];
  context?: Record<string, string>;
  cropTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: "Change image",
  uploadingText: "Uploading...",
  helperText: "JPG, GIF or PNG. 1MB max.",
  altText: "Uploaded image",
  aspectRatio: 1,
  maxFileSize: 1000000, // 1MB
  allowedFormats: () => ["jpg", "jpeg", "png", "gif", "webp"],
  tags: () => [],
  context: () => ({}),
  cropTitle: "Crop your image",
  publicIdPrefix: "upload",
});

// Emits
const emit = defineEmits<{
  "update:modelValue": [value: string];
  "upload-success": [result: any];
  "upload-error": [error: any];
}>();

// State
const isUploading = ref(false);

// Computed
const currentImageUrl = computed(() => {
  return (
    props.modelValue ||
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  );
});

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Load Cloudinary script dynamically
const loadCloudinaryScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.cloudinary) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Cloudinary script"));
    document.head.appendChild(script);
  });
};

const openCloudinaryWidget = async () => {
  try {
    await loadCloudinaryScript();

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      const error = new Error(
        "Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file"
      );
      console.error(error.message);
      emit("upload-error", error);
      return;
    }

    const tenantId = tenantStore.value?.id;
    if (!tenantId) {
      const error = new Error(
        "Tenant ID not found. Please ensure user is logged in and tenant is loaded."
      );
      console.error(error.message);
      emit("upload-error", error);
      return;
    }

    console.log("Upload folder path:", props.folder); // Debug log
    console.log("Tenant ID for tags:", tenantId); // Debug log

    const widgetConfig = {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ["local", "url", "camera"],
      multiple: false,
      maxFiles: 1,
      maxFileSize: props.maxFileSize,
      clientAllowedFormats: props.allowedFormats,
      resourceType: "image",
      folder: props.folder,
      publicId: `${props.publicIdPrefix}_${Date.now()}`,
      cropping: true,
      croppingAspectRatio: props.aspectRatio,
      croppingDefaultSelectionRatio: 1,
      croppingShowBackButton: true,
      showSkipCropButton: false,
      gravity: "center",
      quality: "auto:good",
      fetchFormat: "auto",
      tags: [...props.tags, `tenant_${tenantId}`],
      context: {
        tenant_id: tenantId,
        ...props.context,
      },
      text: {
        en: {
          or: "or",
          back: "Back",
          close: "Close",
          provide_image_alt: "Provide image alt text",
          search_placeholder: "Search files",
          menu: {
            files: "My Files",
            web: "Web Address",
            camera: "Camera",
          },
          crop: {
            title: props.cropTitle,
            crop_btn: "Crop",
            skip_btn: "Skip",
            reset_btn: "Reset",
          },
        },
      },
    };

    console.log("Cloudinary widget config:", widgetConfig); // Debug log

    const widget = window.cloudinary.createUploadWidget(
      widgetConfig,
      (error: any, result: any) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          emit("upload-error", error);
          isUploading.value = false;
          return;
        }

        if (result && result.event === "upload-added") {
          isUploading.value = true;
        }

        if (result && result.event === "success") {
          // Update v-model with the uploaded image URL
          emit("update:modelValue", result.info.secure_url);
          emit("upload-success", result.info);
          isUploading.value = false;
          console.log("Upload successful:", result.info);
        }

        if (result && result.event === "abort") {
          isUploading.value = false;
        }
      }
    );

    widget.open();
  } catch (error) {
    console.error("Error opening Cloudinary widget:", error);
    emit("upload-error", error);
    isUploading.value = false;
  }
};

// Type declarations for Cloudinary
declare global {
  interface Window {
    cloudinary: any;
  }
}
</script>
