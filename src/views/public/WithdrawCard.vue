<script setup lang="ts">
import type { LibraryWithdraw } from '@/features/library/withdraws/service.ts'
import { IconCalendar } from '@tabler/icons-vue'

interface Props {
  withdraw: LibraryWithdraw
  formatDate: (dateStr: string | number) => string
  getDurationHours: (
    startedAt: string | number,
    endedAt: string | number | null,
  ) => number | null
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex-1 pb-4">
    <div
      class="rounded-lg p-4 hover:shadow-md transition-shadow"
      :class="'bg-gray-50 dark:bg-black/20'"
    >
      <div class="flex gap-4">
        <!-- Game Image -->
        <div
          v-if="props.withdraw.library_game?.game?.image"
          class="flex-shrink-0"
        >
          <img
            :src="props.withdraw.library_game.game.image"
            :alt="props.withdraw.library_game.game.name"
            class="w-16 h-16 rounded-lg object-cover"
          />
        </div>

        <!-- Withdraw Details -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h5 class="font-semibold text-gray-900 dark:text-white truncate">
                {{
                  withdraw.library_game?.game?.name ||
                  `Game ${withdraw.library_game_id}`
                }}
              </h5>
              <div
                class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1"
              >
                <IconCalendar class="size-4" />
                <span>{{ formatDate(withdraw.started_at) }}</span>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="flex-shrink-0">
              <span
                :class="[
                  'inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
                  withdraw.ended_at
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                ]"
              >
                {{ withdraw.ended_at ? 'Returned' : 'Active' }}
              </span>
            </div>
          </div>

          <!-- Return Info -->
          <div
            v-if="withdraw.ended_at"
            class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center justify-between text-sm">
              <div class="text-gray-600 dark:text-gray-400">
                Returned on
                {{ formatDate(withdraw.ended_at) }}
              </div>
              <div
                v-if="getDurationHours(withdraw.started_at, withdraw.ended_at)"
                class="text-gray-600 dark:text-gray-400 font-medium"
              >
                {{ getDurationHours(withdraw.started_at, withdraw.ended_at) }}
                hours
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
