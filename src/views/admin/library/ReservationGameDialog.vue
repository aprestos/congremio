<template>
  <DialogComponent
    :open="props.open"
    title="Reservation Details"
    @close="handleClose"
  >
    <div v-if="props.reservation" class="space-y-6">
      <!-- Reservation Number -->
      <div class="text-center">
        <div class="text-4xl font-bold text-gray-900 dark:text-white">
          #{{ props.reservation.display_id }}
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Reservation Number
        </p>
      </div>

      <!-- Game Details -->
      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Game Information
        </h4>
        <div class="flex items-center gap-4">
          <img
            v-if="gameImage"
            :src="gameImage"
            :alt="gameName"
            class="w-20 h-20 rounded-lg object-cover shadow-sm flex-shrink-0"
            @error="handleImageError"
          />
          <div
            v-else
            class="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-sm flex items-center justify-center flex-shrink-0"
          >
            <span class="text-gray-500 dark:text-gray-400 text-xs">
              No Image
            </span>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ gameName }}
            </h3>
            <p
              v-if="gameYear"
              class="text-sm text-gray-600 dark:text-gray-300 mt-1"
            >
              Year: {{ gameYear }}
            </p>
          </div>
        </div>
      </div>

      <!-- User Details -->
      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Reserved By
        </h4>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              User ID:
            </span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ props.reservation.user_id }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Expires At:
            </span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ formattedExpiryTime }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Time Remaining:
            </span>
            <span
              :class="[
                'text-sm font-medium',
                timeRemaining > 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400',
              ]"
            >
              {{ timeRemainingFormatted }}
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div
        class="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end pt-4 border-t border-gray-200 dark:border-gray-600"
      >
        <button
          type="button"
          class="order-2 sm:order-1 w-full sm:w-auto rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          @click="handleClose"
        >
          Close
        </button>
        <button
          type="button"
          class="order-1 sm:order-2 w-full sm:w-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isWithdrawing"
          @click="handleWithdraw"
        >
          <span v-if="isWithdrawing">Withdrawing...</span>
          <span v-else>Withdraw Game</span>
        </button>
      </div>
    </div>
  </DialogComponent>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import DialogComponent from '@/components/DialogComponent.vue'
import type { LibraryReservation } from '@/features/library/reservations/service'

interface LibraryGameWithDetails {
  game?: {
    name?: string
    year?: number
    image?: string
    image_url?: string
  }
}

interface Props {
  open?: boolean
  reservation?: LibraryReservation | null
}

interface Emits {
  (e: 'close'): void
  (e: 'withdraw', reservationId: number): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  reservation: null,
})

const emit = defineEmits<Emits>()

const isWithdrawing = ref(false)

// Computed properties
const gameName = computed(() => {
  if (
    props.reservation?.library_game &&
    typeof props.reservation.library_game === 'object' &&
    'game' in props.reservation.library_game
  ) {
    const libraryGame = props.reservation.library_game as LibraryGameWithDetails
    return libraryGame.game?.name || 'Unknown Game'
  }
  return 'Unknown Game'
})

const gameYear = computed(() => {
  if (
    props.reservation?.library_game &&
    typeof props.reservation.library_game === 'object' &&
    'game' in props.reservation.library_game
  ) {
    const libraryGame = props.reservation.library_game as LibraryGameWithDetails
    return libraryGame.game?.year
  }
  return undefined
})

const gameImage = computed(() => {
  if (
    props.reservation?.library_game &&
    typeof props.reservation.library_game === 'object' &&
    'game' in props.reservation.library_game
  ) {
    const libraryGame = props.reservation.library_game as LibraryGameWithDetails
    return libraryGame.game?.image_url || libraryGame.game?.image
  }
  return undefined
})

const formattedExpiryTime = computed(() => {
  if (!props.reservation?.expires_at) return '-'
  return new Date(props.reservation.expires_at).toLocaleString()
})

const timeRemaining = computed(() => {
  if (!props.reservation?.expires_at) return 0
  const now = new Date().getTime()
  const expiryTime = new Date(props.reservation.expires_at).getTime()
  return expiryTime - now
})

const timeRemainingFormatted = computed(() => {
  const remaining = timeRemaining.value
  if (remaining <= 0) return 'Expired'

  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  return `${minutes}m ${seconds}s`
})

// Event handlers
const handleClose = (): void => {
  isWithdrawing.value = false
  emit('close')
}

const handleWithdraw = (): void => {
  if (!props.reservation) return

  isWithdrawing.value = true
  try {
    emit('withdraw', props.reservation.id)
  } catch (error) {
    console.error('Failed to withdraw game:', error)
    toast.error('Failed to withdraw the game. Please try again.')
  } finally {
    isWithdrawing.value = false
  }
}

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>
