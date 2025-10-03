<template>
  <div class="mx-auto max-w-full md:max-w-7xl mb-4">
    <!-- Reservations Grid -->
    <div class="space-y-4">
      <div
        v-for="reservation in activeReservations"
        :key="reservation.id"
        class="dark:bg-gray-400/30 backdrop-blur-2xl bg-gray-400/50 overflow-hidden shadow rounded-full cursor-pointer hover:shadow-md transition-shadow duration-200 min-w-sm max-w-lg"
        @click="openReservationDetail(reservation)"
      >
        <div class="px-3 py-3 sm:p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="h-16 w-16 text-xl text-white dark:text-white font-semibold rounded-full bg-gray-800/50 dark:bg-gray-100/40 flex items-center justify-center"
                >
                  {{ reservation.display_id }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-gray-600 dark:text-white/50 text-sm">
                  Reservation
                </p>
                <h3
                  class="text-xl font-semibold text-gray-900 dark:text-white truncate"
                >
                  {{
                    (reservation.library_game as any)?.game?.name ||
                    'Unknown Game'
                  }}
                </h3>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-1">
              <CircularCountdown
                :time="getTimeRemaining(reservation.expires_at)"
                :total-time="4 * 60 * 1000"
                :size="60"
                :stroke-width="6"
                :show-label="false"
                format="mm:ss"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reservation Detail Dialog -->
    <DialogComponent
      :open="isDetailModalOpen"
      :title="`Reservation #${selectedReservation?.display_id || ''}`"
      @close="closeReservationDetail"
    >
      <div v-if="selectedReservation" class="space-y-6">
        <!-- Reservation Info -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Reservation Details
          </h4>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Reservation ID
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                #{{ selectedReservation.display_id }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Library Game
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{
                  (selectedReservation.library_game as any)?.game?.name ||
                  'Unknown Game'
                }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </dt>
              <dd class="mt-1">
                <CBadge
                  :type="getReservationStatusColor(selectedReservation)"
                  :text="getReservationStatus(selectedReservation)"
                />
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Expires At
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ formatExpirationDetailed(selectedReservation.expires_at) }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Time Remaining -->
        <div
          class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div class="flex items-center">
            <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
            <div class="ml-3">
              <h4
                class="text-sm font-medium text-yellow-800 dark:text-yellow-200"
              >
                Time Remaining
              </h4>
              <p class="text-sm text-yellow-700 dark:text-yellow-300">
                {{ getTimeRemaining(selectedReservation.expires_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end pt-4 border-t border-gray-200 dark:border-gray-600"
        >
          <CButton
            variant="secondary"
            size="lg"
            class="order-2 sm:order-1 w-full sm:w-auto"
            @click="closeReservationDetail"
          >
            Close
          </CButton>
          <CButton
            variant="danger"
            size="lg"
            class="order-1 sm:order-2 w-full sm:w-auto"
            :loading="cancellingReservation"
            @click="cancelReservation"
          >
            Cancel Reservation
          </CButton>
        </div>
      </div>
    </DialogComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import libraryReservationService, {
  type LibraryReservation,
} from '@/features/library/reservations/service'
import CBadge from '@/components/CBadge.vue'
import CButton from '@/components/CButton.vue'
import DialogComponent from '@/components/DialogComponent.vue'
import CircularCountdown from '@/components/CircularCountdown.vue'
import { toast } from 'vue-sonner'

const reservations = ref<LibraryReservation[]>([])
const loading = ref(true)
const selectedReservation = ref<LibraryReservation | null>(null)
const isDetailModalOpen = ref(false)
const cancellingReservation = ref(false)

let unsubscribe: (() => void) | null = null

// Current time for reactivity
const now = ref(Date.now())

// Update current time every second
setInterval(() => {
  now.value = Date.now()
}, 1000)

// Filter out expired reservations
const activeReservations = computed(() => {
  // Force reactivity by accessing now.value
  void now.value
  return reservations.value.filter((reservation) => {
    const timeRemaining = getTimeRemaining(reservation.expires_at)
    return timeRemaining > 0
  })
})

onMounted(() => {
  // Subscribe to realtime updates
  unsubscribe = libraryReservationService.subscribeToUpdates(
    (updatedReservations) => {
      reservations.value = updatedReservations
      loading.value = false
    },
  )
})

onUnmounted(() => {
  // Clean up subscription
  if (unsubscribe) {
    unsubscribe()
  }
})

const openReservationDetail = (reservation: LibraryReservation): void => {
  selectedReservation.value = reservation
  isDetailModalOpen.value = true
}

const closeReservationDetail = (): void => {
  isDetailModalOpen.value = false
  selectedReservation.value = null
  cancellingReservation.value = false
}

const getReservationStatus = (reservation: LibraryReservation): string => {
  const now = new Date()
  const expiresAt = new Date(reservation.expires_at)

  if (expiresAt <= now) {
    return 'Expired'
  }

  const timeUntilExpiration = expiresAt.getTime() - now.getTime()
  const hoursUntilExpiration = timeUntilExpiration / (1000 * 60 * 60)

  if (hoursUntilExpiration <= 1) {
    return 'Expiring Soon'
  }

  return 'Active'
}

const getReservationStatusColor = (
  reservation: LibraryReservation,
):
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink' => {
  const status = getReservationStatus(reservation)

  switch (status) {
    case 'Expired':
      return 'red'
    case 'Expiring Soon':
      return 'yellow'
    case 'Active':
      return 'green'
    default:
      return 'gray'
  }
}

const formatExpirationDetailed = (expiresAt: string): string => {
  const date = new Date(expiresAt)
  return date.toLocaleString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getTimeRemaining = (expiresAt: string): number => {
  const now: number = new Date().getTime()
  const newYear: number = new Date(expiresAt).getTime()

  return newYear - now
}

const cancelReservation = (): void => {
  if (!selectedReservation.value) return

  try {
    cancellingReservation.value = true
    // TODO: Implement cancel reservation API call
    // await libraryReservationService.cancel(selectedReservation.value.id)

    toast.success('Reservation cancelled successfully')
    closeReservationDetail()
  } catch (error) {
    toast.error('Failed to cancel reservation')
    console.error('Error cancelling reservation:', error)
  } finally {
    cancellingReservation.value = false
  }
}
</script>

<style scoped></style>
