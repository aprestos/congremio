<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  label: string
  value: string | number
  icon: Component
  iconColor?: string
  valueColor?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  iconColor: 'text-gray-900 dark:text-gray-400',
  valueColor: 'text-gray-900 dark:text-white',
  subtitle: '',
})
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 sm:rounded-lg sm:shadow p-6 sm:ring-1 sm:ring-gray-200 sm:dark:ring-gray-700"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
          {{ label }}
        </p>
        <p class="mt-2 text-2xl font-bold" :class="valueColor">
          {{ value }}
        </p>
        <p
          v-if="subtitle"
          class="mt-2 text-xs text-gray-600 dark:text-gray-400"
        >
          {{ subtitle }}
        </p>
      </div>
      <component :is="icon" class="size-8" :class="iconColor" />
    </div>
  </div>
</template>
