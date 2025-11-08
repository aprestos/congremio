<template>
  <div class="mx-auto max-w-full md:max-w-7xl mb-4">
    <!-- Reservation Detail Dialog -->
    <DialogComponent
      :open="props.open"
      title=""
      @close="closeReservationDetail"
    >
      <div v-if="props.reservation" class="space-y-6">
        <!-- Large Reservation Number -->
        <div class="text-center">
          <div class="text-6xl font-bold text-gray-900 dark:text-white">
            #{{ props.reservation.display_id }}
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Reservation Number
          </p>
        </div>

        <!-- Game Info with Image -->
        <div
          class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 flex items-center gap-6"
        >
          <img
            v-if="props.reservation.library_game.game?.image"
            :src="props.reservation.library_game.game.image"
            :alt="props.reservation.library_game.game?.name || 'Game'"
            class="w-32 h-32 object-cover rounded-lg shadow-md flex-shrink-0"
          />
          <div
            v-else
            class="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-md flex items-center justify-center flex-shrink-0"
          >
            <span class="text-gray-500 dark:text-gray-400 text-sm">
              No Image
            </span>
          </div>
          <div class="flex flex-col justify-center">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ props.reservation.library_game.game?.name || 'Unknown Game' }}
            </h3>
            <p
              v-if="props.reservation.library_game.game?.year"
              class="text-lg text-gray-600 dark:text-gray-300 mt-1"
            >
              {{ props.reservation.library_game.game.year }}
            </p>
          </div>
        </div>

        <!-- Countdown Timer -->
        <div class="flex flex-col items-center space-y-3">
          <CircularCountdown
            :time="getTimeRemaining(props.reservation.expires_at)"
            :total-time-minutes="15"
            :size="120"
            :stroke-width="8"
            :show-label="true"
            label="remaining"
            format="mm:ss"
          />
        </div>

        <!-- Actions -->
        <div
          class="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end pt-4"
        >
          <CButton
            variant="secondary"
            size="lg"
            class="order-2 sm:order-1 w-full sm:w-auto"
            @click="closeReservationDetail"
          >
            Close
          </CButton>
        </div>
      </div>
    </DialogComponent>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type LibraryReservation } from '@/features/library/reservations/service.ts'
import CButton from '@/components/CButton.vue'
import DialogComponent from '@/components/DialogComponent.vue'
import CircularCountdown from '@/components/CircularCountdown.vue'

interface Props {
  reservation: LibraryReservation | null
  open?: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

const emit = defineEmits<Emits>()

const cancellingReservation = ref(false)

const closeReservationDetail = (): void => {
  cancellingReservation.value = false
  emit('close')
}

const getTimeRemaining = (expiresAt: string): number => {
  const now: number = new Date().getTime()
  const expiryTime: number = new Date(expiresAt).getTime()

  return expiryTime - now
}
</script>

<style scoped></style>
