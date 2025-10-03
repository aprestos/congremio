<script setup lang="ts">
import {
  getStatus,
  getStatusLabel,
  type LibraryGame,
} from '@/features/library/game.model.ts'
import CBadge from '@/components/CBadge.vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import libraryWithdrawService, {
  type LibraryWithdraw,
} from '@/features/library/withdraws/service.ts'
import { userService, type User } from '@/features/users/service.ts'
import { ref, computed } from 'vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline'
import {
  IconCheck,
  IconX,
  IconClockFilled,
  IconUserFilled,
  IconExclamationMark,
} from '@tabler/icons-vue'
import { useTimeAgo } from '@vueuse/core'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

const props = defineProps<{ data: LibraryGame }>()

const withdraw = ref<LibraryWithdraw | undefined>(undefined)
const withdrawUser = ref<User | null | undefined>(undefined)
const createdByUser = ref<User | null | undefined>(undefined)
const isLoadingWithdraw = ref(false)
const isLoadingUsers = ref(false)

// Computed properties for safe template access
const withdrawDate = computed(() => {
  if (!withdraw.value?.started_at) return new Date().toLocaleDateString()
  return useTimeAgo(withdraw.value.started_at)
})

const withdrawnByDisplay = computed(() => {
  if (withdrawUser.value?.name) return withdrawUser.value.name
  if (withdrawUser.value?.email) return withdrawUser.value.email
  return withdraw.value?.user_id || 'Unknown'
})

const fetchWithdrawDetails = async (): Promise<void> => {
  if (!withdraw.value) {
    isLoadingWithdraw.value = true
    withdraw.value = await libraryWithdrawService.getActiveByLibraryGameId(
      props.data.id,
    )
    isLoadingWithdraw.value = false
  }

  if (withdraw.value) {
    // Fetch user information for the withdraw user
    isLoadingUsers.value = true
    try {
      withdrawUser.value = await userService.getById(withdraw.value.user_id)
    } catch (error) {
      console.error('Failed to fetch withdraw user:', error)
      withdrawUser.value = null
    }
    isLoadingUsers.value = false

    // Fetch user information for created_by if different from user_id
    if (
      withdraw.value.created_by &&
      withdraw.value.created_by !== withdraw.value.user_id
    ) {
      isLoadingUsers.value = true
      try {
        createdByUser.value = await userService.getById(
          withdraw.value.created_by,
        )
      } catch (error) {
        console.error('Failed to fetch created_by user:', error)
        createdByUser.value = null
      }
      isLoadingUsers.value = false
    }
  }
}
</script>

<template>
  <Popover class="relative group">
    <PopoverButton
      class="cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full"
    >
      <CBadge v-show="getStatus(props.data) === 'available'" type="green"
        ><span class="hidden md:inline">Available</span
        ><span class="md:hidden"><IconCheck /></span
      ></CBadge>
      <CBadge
        v-show="getStatus(props.data) === 'withdrawn'"
        text=""
        type="yellow"
        @click="fetchWithdrawDetails"
        ><span class="hidden md:inline">{{ getStatusLabel(props.data) }}</span
        ><span class="md:hidden"><IconExclamationMark /></span
      ></CBadge>
      <CBadge
        v-show="getStatus(props.data) === 'not-available'"
        text="Not available"
        type="red"
      >
        <span class="hidden md:inline">{{ getStatusLabel(props.data) }}</span
        ><span class="md:hidden"><IconX /></span>
      </CBadge>
      <CBadge
        v-show="getStatus(props.data) === 'reserved'"
        text="Reserved"
        type="blue"
      >
        <span class="hidden md:inline">{{ getStatusLabel(props.data) }}</span
        ><span class="md:hidden"><IconX /></span>
      </CBadge>
    </PopoverButton>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <PopoverPanel
        class="absolute z-10 mt-2 w-64 rounded-lg bg-white ring-gray-200 p-4 shadow-lg ring-1 ring-opacity-5 focus:outline-none"
      >
        <div class="space-y-3">
          <!-- Available Status -->
          <div
            v-if="getStatus(props.data) === 'available'"
            class="text-sm text-gray-600"
          >
            <h3 class="text-sm font-semibold text-gray-900">
              <CheckCircleIcon
                class="h-5 w-5 inline-block mr-1.5 text-green-500"
              />
              Available for borrowing
            </h3>
            <p class="mt-2 text-xs text-gray-500">
              You can withdraw this game from the library.
            </p>
          </div>

          <!-- Withdrawn Status with Details -->
          <div
            v-else-if="getStatus(props.data) === 'withdrawn'"
            class="space-y-2"
          >
            <div v-if="withdraw" class="text-sm">
              <h3 class="text-sm font-semibold text-gray-900">
                Withdrawn from the library
              </h3>
              <p class="text-gray-600 mb-2"></p>

              <div class="space-y-2 text-sm">
                <div class="flex flex-row">
                  <IconClockFilled
                    v-if="!isLoadingWithdraw"
                    class="mr-2"
                    size="18"
                  />
                  <span v-if="!isLoadingWithdraw">{{ withdrawDate }}</span>
                  <SkeletonLoader v-else class="inline-block w-20 h-4" />
                </div>
                <div class="flex flex-row">
                  <IconUserFilled
                    v-if="!isLoadingUsers"
                    class="mr-2"
                    size="18"
                  />
                  <span v-if="!isLoadingUsers">{{ withdrawnByDisplay }}</span>
                  <SkeletonLoader v-else class="inline-block w-24 h-4" />
                </div>
              </div>
            </div>
            <div v-else-if="isLoadingWithdraw" class="text-sm text-gray-600">
              <div class="space-y-2">
                <SkeletonLoader class="h-4 w-48" />
                <SkeletonLoader class="h-3 w-32" />
                <SkeletonLoader class="h-3 w-40" />
              </div>
            </div>
            <div v-else class="text-sm text-gray-600">
              <p>This game is currently withdrawn from the library.</p>
            </div>
          </div>

          <!-- Not Available Status -->
          <div
            v-else-if="getStatus(props.data) === 'not-available'"
            class="text-sm text-gray-600"
          >
            <p>
              <XCircleIcon class="h-5 w-5 inline-block mr-1.5 text-red-500" />
              This game is currently not available.
            </p>
            <p class="mt-2 text-xs text-gray-500">
              The game may be under maintenance or temporarily unavailable.
            </p>
          </div>

          <!-- Reserved Status -->
          <div
            v-else-if="getStatus(props.data) === 'reserved'"
            class="text-sm text-gray-600"
          >
            <p>
              <ClockIcon class="h-5 w-5 inline-block mr-1.5 text-blue-500" />
              This game has been reserved by another user.
            </p>
            <p class="mt-2 text-xs text-gray-500">
              Please check back later when the reservation expires.
            </p>
          </div>

          <div class="border-t border-gray-200 pt-3">
            <p class="text-xs text-gray-500">
              Last updated: {{ useTimeAgo(new Date()) }}
            </p>
          </div>
        </div>
      </PopoverPanel>
    </Transition>
  </Popover>
</template>

<style scoped></style>
