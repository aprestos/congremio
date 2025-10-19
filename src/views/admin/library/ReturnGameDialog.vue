<script setup lang="ts">
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import type { LibraryGame } from '@/features/library/game.model.ts'

interface Props {
  open: boolean
  selectedGame: LibraryGame | null
  isReturningGame: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirm: []
  cancel: []
}>()
</script>

<template>
  <ConfirmationDialog
    :open="open"
    title="Return Game"
    confirm-text="Yes, return it"
    cancel-text="Cancel"
    :loading="isReturningGame"
    @confirm="emit('confirm')"
    @cancel="emit('cancel')"
    @close="emit('close')"
  >
    <template #default>
      <div class="space-y-6">
        <!-- Game Card -->
        <div class="flex items-center space-x-4">
          <div class="shrink-0">
            <img
              class="size-16 rounded-lg object-cover shadow-sm"
              :src="selectedGame?.game.image || '/placeholder-game.jpg'"
              :alt="selectedGame?.game.name || 'Game image'"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white truncate"
            >
              {{ selectedGame?.game.name || 'Unknown Game' }}
            </h3>
            <div
              class="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
            >
              <span
                v-if="selectedGame?.location?.name"
                class="flex items-center"
              >
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
                {{ selectedGame?.location?.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Confirmation Message -->
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to return this game to the library?
        </p>
      </div>
    </template>
  </ConfirmationDialog>
</template>
