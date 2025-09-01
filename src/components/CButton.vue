<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="flex items-center gap-2">
      <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {{ loadingText || 'Loading...' }}
    </span>
    <span v-else class="flex items-center gap-2">
      <slot name="icon-left" />
      <slot />
      <slot name="icon-right" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  loadingText: 'Loading...',
  fullWidth: false,
  rounded: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    'transition-colors',
    'duration-200',
    'focus-visible:outline',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ]

  // Size classes
  const sizeClasses = {
    sm: ['px-2.5', 'py-1.5', 'text-xs'],
    md: ['px-3', 'py-2', 'text-sm'],
    lg: ['px-4', 'py-2.5', 'text-base'],
  }

  // Variant classes
  const variantClasses = {
    primary: [
      'bg-indigo-600',
      'text-white',
      'shadow-xs',
      'hover:bg-indigo-500',
      'focus-visible:outline-indigo-600',
      'dark:bg-indigo-500',
      'dark:shadow-none',
      'dark:hover:bg-indigo-400',
      'dark:focus-visible:outline-indigo-500',
    ],
    secondary: [
      'bg-white',
      'text-gray-900',
      'shadow-xs',
      'ring-1',
      'ring-inset',
      'ring-gray-300',
      'hover:bg-gray-50',
      'focus-visible:outline-indigo-600',
      'dark:bg-white/10',
      'dark:text-white',
      'dark:shadow-none',
      'dark:ring-white/5',
      'dark:hover:bg-white/20',
      'dark:focus-visible:outline-indigo-500',
    ],
    tertiary: [
      'bg-transparent',
      'text-gray-700',
      'hover:text-gray-900',
      'hover:bg-gray-50',
      'focus-visible:outline-indigo-600',
      'dark:text-gray-300',
      'dark:hover:text-white',
      'dark:hover:bg-white/10',
      'dark:focus-visible:outline-indigo-500',
    ],
    yellow: [
      'bg-amber-500',
      'text-white',
      'shadow-xs',
      'hover:bg-amber-400',
      'focus-visible:outline-amber-500',
      'dark:bg-amber-500',
      'dark:shadow-none',
      'dark:hover:bg-amber-400',
      'dark:focus-visible:outline-amber-500',
    ],
  }

  // Border radius classes
  const roundedClasses = props.rounded ? ['rounded-full'] : ['rounded-md']

  // Full width classes
  const widthClasses = props.fullWidth ? ['w-full'] : []

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...roundedClasses,
    ...widthClasses,
  ].join(' ')
})
</script>
