<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  color?: 'red' | 'yellow' | 'blue' | 'green' | 'gray'
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'gray',
  text: 'Toast message',
})

const toastClasses = computed(() => {
  const baseClasses = [
    'relative',
    'flex',
    'items-center',
    'w-full',
    'max-w-md',
    'p-4',
    'rounded-xl',
    'shadow-2xl',
    'border',
  ]

  const colorClasses = {
    gray: [
      'bg-gray-100',
      'border-gray-300',
      'text-gray-700',
      'dark:bg-gray-100',
      'dark:border-gray-300',
      'dark:text-gray-700',
    ],
    red: [
      'bg-red-100',
      'border-red-300',
      'text-red-700',
      'dark:bg-red-100',
      'dark:border-red-300',
      'dark:text-red-700',
    ],
    yellow: [
      'bg-yellow-100',
      'border-yellow-300',
      'text-yellow-700',
      'dark:bg-yellow-100',
      'dark:border-yellow-300',
      'dark:text-yellow-700',
    ],
    blue: [
      'bg-blue-100',
      'border-blue-300',
      'text-blue-700',
      'dark:bg-blue-100',
      'dark:border-blue-300',
      'dark:text-blue-700',
    ],
    green: [
      'bg-green-100',
      'border-green-300',
      'text-green-700',
      'dark:bg-green-100',
      'dark:border-green-300',
      'dark:text-green-700',
    ],
  }

  return [...baseClasses, ...colorClasses[props.color]].join(' ')
})
</script>

<template>
  <div :class="toastClasses" role="alert">
    <div class="flex items-center flex-1">
      <div class="flex-1 text-center">
        <p class="text-sm font-medium leading-relaxed">
          {{ props.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
