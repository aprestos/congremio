<template>
  <SettingsSection
    title="Organizer Information"
    description="Manage your organization's basic information including name, contact details and logo"
  >
    <form @submit="handleSubmit">
      <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div class="col-span-full">
          <div class="flex items-center gap-x-8">
            <img
              :src="
                logoUrl ||
                tenantStore?.logo ||
                'https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
              "
              alt="Organization logo"
              class="size-24 flex-none rounded-lg bg-gray-100 object-cover outline -outline-offset-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10"
              @error="handleImageError"
              @load="handleImageLoad"
            />
            <div>
              <CButton variant="secondary" @click="showUploadDialog = true">
                Change logo
              </CButton>
              <p class="mt-2 text-sm text-gray-500">
                JPG, PNG, GIF or WebP. Max file size: 5MB.
              </p>
              <FilePondUploadDialog
                :open="showUploadDialog"
                title="Upload Logo"
                description="Select a logo image for your organization (max 5MB)"
                :allow-multiple="false"
                :accepted-file-types="[
                  'image/jpeg',
                  'image/png',
                  'image/gif',
                  'image/webp',
                ]"
                max-file-size="5MB"
                :max-files="1"
                supabase-bucket="images"
                :supabase-path="logoFolder"
                file-naming-strategy="uuid"
                :supabase-options="{
                  cacheControl: '31536000',
                  upsert: false,
                }"
                @close="showUploadDialog = false"
                @upload-success="handleLogoUploadSuccess"
                @upload-error="handleLogoUploadError"
              />
            </div>
          </div>
        </div>

        <CInput
          id="event-name"
          v-model="formData.name"
          label="Event Name"
          name="event-name"
          :errors="r$.$errors.name"
        />

        <CInput
          id="email"
          v-model="formData.email"
          label="Email address"
          type="email"
          name="email"
          :errors="
            r$.$errors.email.length > 0 ? [r$.$errors.email[0]] : undefined
          "
        />
      </div>

      <div class="mt-8 flex">
        <CButton type="submit" :loading="isSaving" loading-text="Saving...">
          Save
        </CButton>
      </div>
    </form>
  </SettingsSection>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core'
import { alpha, email, maxLength, minLength, required } from '@regle/rules'
import { computed, ref, watchEffect } from 'vue'
import { toast } from 'vue-sonner'
import CButton from '@/components/CButton.vue'
import CInput from '@/components/CInput.vue'
import FilePondUploadDialog from '@/components/FilePondUploadDialog.vue'
import SettingsSection from '@/components/SettingsSection.vue'
import tenantService from '@/features/tenant/service'
import { tenantStore } from '@/stores/tenant'

// Logo state
const logoUrl = ref(tenantStore.value?.logo)
const showUploadDialog = ref(false)

// Computed folder path with actual tenant ID
const logoFolder = computed((): string => {
  const tenantId = tenantStore.value?.id
  return tenantId ? `tenants/${tenantId}/logos` : 'tenants/default/logos'
})

// Handle image load/error events for debugging
const handleImageError = (event: Event): void => {
  const img = event.target as HTMLImageElement
  console.error('Image failed to load:', {
    src: img.src,
    logoUrl: logoUrl.value,
    tenantStoreLogo: tenantStore.value?.logo,
    error: event,
  })
}

const handleImageLoad = (event: Event): void => {
  const img = event.target as HTMLImageElement
  console.log('Image loaded successfully:', {
    src: img.src,
    logoUrl: logoUrl.value,
    tenantStoreLogo: tenantStore.value?.logo,
  })
}

// Handle logo upload success
const handleLogoUploadSuccess = (urls: string | string[]): void => {
  showUploadDialog.value = false
  const url = Array.isArray(urls) ? urls[0] : urls
  logoUrl.value = url
  console.log('Logo uploaded successfully:', url)
  toast.success('Logo uploaded successfully!')
}

// Handle logo upload error
const handleLogoUploadError = (error: any): void => {
  console.error('Logo upload failed:', error)
  toast.error('Failed to upload logo. Please try again.')
}

// Form data
const formData = ref({
  name: '',
  email: '',
})

// Regle validation setup
const { r$ } = useRegle(formData, {
  name: {
    required,
    alpha,
    minLength: minLength(2),
    maxLength: maxLength(50),
  },
  email: {
    required,
    email,
  },
})

// Loading state for save operation
const isSaving = ref(false)

// Initialize form data with current tenant data
const initializeFormData = (): void => {
  if (tenantStore.value) {
    formData.value.name = tenantStore.value.name || ''
    formData.value.email = tenantStore.value.email || ''
    logoUrl.value = tenantStore.value.logo || logoUrl.value
  }
}

// Initialize form when component mounts or tenant changes
watchEffect((): void => {
  if (tenantStore.value) {
    initializeFormData()
  }
})

// Save tenant function
const saveTenant = async (): Promise<void> => {
  try {
    const tenantId = tenantStore.value?.id
    if (!tenantId) {
      console.error('No tenant ID found')
      toast.error('No tenant ID found. Please refresh and try again.')
      return
    }

    isSaving.value = true

    // Prepare updates - only include defined values
    const updates: { name?: string; email?: string; logo?: string } = {}

    if (formData.value.name.trim()) {
      updates.name = formData.value.name.trim()
    }

    if (formData.value.email.trim()) {
      updates.email = formData.value.email.trim()
    }

    if (logoUrl.value && logoUrl.value !== tenantStore.value?.logo) {
      updates.logo = logoUrl.value
    }

    // Save to database
    const updatedTenant = await tenantService.updateTenant(tenantId, updates)

    if (updatedTenant) {
      console.log('Tenant saved successfully:', updatedTenant)

      // Update the tenant store with the new data
      if (tenantStore.value) {
        tenantStore.value = { ...tenantStore.value, ...updatedTenant }
      }

      toast.success('Organization settings saved successfully!')
    } else {
      console.error('Failed to save tenant settings')
      toast.error('Failed to save settings. Please try again.')
    }
  } catch (error) {
    console.error('Error saving tenant:', error)
    toast.error('An error occurred while saving. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Handle form submit
const handleSubmit = async (event: Event): Promise<void> => {
  event.preventDefault()

  if (isSaving.value) return

  // Validate form before submitting
  const { valid } = await r$.$validate()

  if (!valid) {
    console.log('Form has validation errors')
    return
  }

  await saveTenant()
}
</script>
