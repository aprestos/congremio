<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DialogComponent from '@/components/DialogComponent.vue'
import type { LibraryGame } from '@/features/library/game.model.ts'
import libraryWithdrawService from '@/features/library/withdraws/service.ts'
import { toast } from 'vue-sonner'
import libraryService from '@/features/library/service.ts'
import libraryReservationService from '@/features/library/reservations/service.ts'
import logger from '@/lib/logger.ts'

const { t } = useI18n()

interface Props {
  open: boolean
  selectedGame: LibraryGame | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const isDeletingGame = ref(false)
const isLoading = ref(false)
const canBeDeleted = ref<boolean>(false)

onMounted(() => {
  canBeDeleted.value = false
  isLoading.value = false
})

watch(
  () => props.open,
  async (): Promise<void> => {
    if (!props.selectedGame) return
    isLoading.value = true
    const [loansCount, reservationsCount] = await Promise.all([
      libraryWithdrawService.countByGame(props.selectedGame.id),
      libraryReservationService.countByGame(props.selectedGame.id),
    ])
    if (loansCount === 0 && reservationsCount === 0) {
      canBeDeleted.value = true
    }
    isLoading.value = false
  },
)

const deleteGame = async (): Promise<void> => {
  if (!props.selectedGame) return
  isDeletingGame.value = true

  try {
    await libraryService.deleteGame(props.selectedGame.id)
    toast.success(
      t('admin.library.deleteSuccess', { name: props.selectedGame.game.name }),
    )
    emit('close')
  } catch (error) {
    logger.error('Failed to delete game', { error })
    toast.error(t('admin.library.deleteFailed'))
    throw error
  } finally {
    isDeletingGame.value = false
  }
}
</script>

<template>
  <DialogComponent
    :open="open"
    :title="t('admin.library.deleteGame')"
    @close="emit('close')"
  >
    <div v-if="selectedGame" class="space-y-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400"
        />
        <span class="ml-3 text-sm text-gray-600 dark:text-gray-400">{{
          t('admin.library.checkingHistory')
        }}</span>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Warning if withdraws exist -->
        <div
          v-if="!canBeDeleted"
          class="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4 mb-4"
        >
          <div class="flex">
            <div class="shrink-0">
              <svg
                class="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  {{ t('admin.library.cannotDeleteHasHistory') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirmation message if no withdraws -->
        <div v-else-if="canBeDeleted">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('admin.library.confirmDelete') }}
            <strong class="text-gray-900 dark:text-white">
              {{ selectedGame.game.name }}
            </strong>
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {{ t('admin.library.deleteWarning') }}
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 justify-end pt-4">
        <button
          type="button"
          class="rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          @click="emit('close')"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          type="button"
          class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canBeDeleted || isDeletingGame"
          @click="deleteGame"
        >
          <span v-if="isDeletingGame">{{ t('common.loading') }}</span>
          <span v-else>{{ t('common.delete') }}</span>
        </button>
      </div>
    </div>
  </DialogComponent>
</template>
