<script setup lang="ts">
import type { LibraryWithdraw } from '@/features/library/withdraws/service.ts'
import { DateTime } from 'luxon'
import WithdrawCard from './WithdrawCard.vue'

interface Props {
  withdraws: LibraryWithdraw[]
}

defineProps<Props>()

function formatDate(dateStr: string | number): string {
  try {
    const date =
      typeof dateStr === 'string'
        ? DateTime.fromISO(dateStr)
        : DateTime.fromMillis(Number(dateStr))
    return date.toFormat('MMM dd, yyyy HH:mm')
  } catch {
    return 'Invalid date'
  }
}

function getDay(dateStr: string | number): string {
  try {
    const date =
      typeof dateStr === 'string'
        ? DateTime.fromISO(dateStr)
        : DateTime.fromMillis(Number(dateStr))
    return date.toFormat('dd')
  } catch {
    return '--'
  }
}

function getMonth(dateStr: string | number): string {
  try {
    const date =
      typeof dateStr === 'string'
        ? DateTime.fromISO(dateStr)
        : DateTime.fromMillis(Number(dateStr))
    return date.toFormat('MMM')
  } catch {
    return '---'
  }
}

function getDurationHours(
  startedAt: string | number,
  endedAt: string | number | null,
): number | null {
  try {
    const start =
      typeof startedAt === 'string'
        ? DateTime.fromISO(startedAt)
        : DateTime.fromMillis(Number(startedAt))
    if (!endedAt) return null
    const end =
      typeof endedAt === 'string'
        ? DateTime.fromISO(endedAt)
        : DateTime.fromMillis(Number(endedAt))
    return Math.round(end.diff(start, 'hours').hours * 10) / 10
  } catch {
    return null
  }
}
</script>

<template>
  <div class="relative">
    <!-- Continuous timeline line -->
    <div
      class="absolute left-20 top-3 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"
    ></div>

    <!-- Timeline items -->
    <div class="space-y-6">
      <div
        v-for="withdraw in withdraws"
        :key="withdraw.id"
        class="flex gap-4 relative"
      >
        <!-- Day badge -->
        <div class="w-16 flex-shrink-0 text-center pt-1">
          <div class="rounded-lg bg-indigo-100 dark:bg-indigo-900/30 px-2 py-1">
            <div class="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {{ getDay(withdraw.started_at) }}
            </div>
            <div
              class="text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider"
            >
              {{ getMonth(withdraw.started_at) }}
            </div>
          </div>
        </div>

        <!-- Timeline dot -->
        <div class="flex flex-col items-center pt-1">
          <div
            :class="[
              'w-3 h-3 rounded-full ring-4 relative z-10',
              withdraw.ended_at
                ? 'bg-green-500 ring-white dark:ring-gray-900'
                : 'bg-blue-500 ring-white dark:ring-gray-900',
            ]"
          ></div>
        </div>

        <!-- Withdraw Card -->
        <WithdrawCard
          :withdraw="withdraw"
          :format-date="formatDate"
          :get-duration-hours="getDurationHours"
        />
      </div>
    </div>
  </div>
</template>
