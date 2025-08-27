<template>
  <div class="space-y-8">
    <!-- Game Card -->
    <div
      class="border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
    >
      <div class="flex items-center space-x-4">
        <div class="size-20 shrink-0">
          <img
            class="size-20 rounded-lg object-cover shadow-sm"
            :src="game?.game.image || '/placeholder-game.jpg'"
            :alt="game?.game.name || 'Game image'"
          />
        </div>
        <div class="flex-1 min-w-0">
          <h3
            class="text-xl font-semibold text-gray-900 dark:text-white truncate"
          >
            {{ game?.game.name || "Unknown Game" }}
          </h3>
          <div
            class="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
          >
            <span class="flex items-center">
              <svg
                class="size-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {{ game?.game.year || "Unknown" }}
            </span>
            <span class="flex items-center" v-if="game?.location?.name">
              <svg
                class="size-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {{ game?.location?.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Withdraw Form -->
    <form @submit.prevent="submit" class="space-y-6">
      <div class="p-6">
        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Select User
        </h4>
        <CSelect
          id="withdraw-to-user"
          label="Withdraw to"
          v-model="formData.selectedUser"
          placeholder="Search and select a user..."
          :on-search="userService.search"
          :errors="r$.$errors.selectedUser"
        />
      </div>

      <!-- Action Buttons -->
      <div
        class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
      >
        <CButton
          type="submit"
          variant="yellow"
          :loading="isSubmitting"
          loading-text="Withdrawing..."
          class="sm:col-start-2"
        >
          <svg
            class="size-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Withdraw Game
        </CButton>
        <CButton
          type="button"
          variant="secondary"
          @click="emit('close')"
          class="mt-3 sm:col-start-1 sm:mt-0"
        >
          Cancel
        </CButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRegle } from "@regle/core";
import { required } from "@regle/rules";
import { ref } from "vue";
import type { Option } from "vue3-select-component";
//import { toast } from "vue3-toastify";

import { toast } from "vue-sonner";
import "vue-sonner/style.css";

import CButton from "@/components/CButton.vue";
import CSelect from "@/components/CSelect.vue";
import type { LibraryGame } from "@/features/library/game.model.ts";
import libraryWithdrawService from "@/features/library/withdraws/service.ts";
import { userService } from "@/features/users/service.ts";

interface Props {
  game: LibraryGame | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "game-withdrawn": [];
  close: [];
}>();

const formData = ref({
  selectedUser: undefined as number | undefined,
});

const isSubmitting = ref(false);

// Mock users data - replace with real user service later
const users = ref<Option<number>[]>([
  { label: "John Smith (john@example.com)", value: 1 },
  { label: "Sarah Johnson (sarah@example.com)", value: 2 },
  { label: "Mike Davis (mike@example.com)", value: 3 },
  { label: "Emily Brown (emily@example.com)", value: 4 },
  { label: "Alex Wilson (alex@example.com)", value: 5 },
  { label: "Lisa Garcia (lisa@example.com)", value: 6 },
  { label: "David Martinez (david@example.com)", value: 7 },
  { label: "Jessica Taylor (jessica@example.com)", value: 8 },
]);

const { r$ } = useRegle(formData, {
  selectedUser: {},
});

const submit = async () => {
  if (isSubmitting.value) return;

  // Validate form before submitting
  const { valid, data } = await r$.$validate();

  if (!valid) {
    console.log("Form has validation errors");
    return;
  }

  isSubmitting.value = true;

  try {
    console.log("Withdrawing game:", {
      gameId: props.game?.id,
      toUserId: data.selectedUser,
    });

    // Call the withdraw service
    await libraryWithdrawService.post(
      props.game?.id as number,
      "2753d47d-8f5c-4f56-b7f9-8e28e6e8bd23",
    );

    toast.success(`${props.game?.game.name} withdrawn successfully.`);

    // Emit event to notify parent that game was withdrawn successfully
    emit("game-withdrawn");
  } catch (error) {
    console.error("Error withdrawing game:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Expose the submit function so parent components can call it
defineExpose({
  submit,
});
</script>
