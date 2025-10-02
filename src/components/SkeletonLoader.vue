<template>
  <div
    :class="[
      'animate-pulse bg-gray-200 dark:bg-gray-700',
      shapeClasses,
      sizeClasses,
      roundedClasses,
      className,
    ]"
    :style="customStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Custom CSS classes */
  className?: string
  /** Width of the skeleton */
  width?: string | number
  /** Height of the skeleton */
  height?: string | number
  /** Shape variant */
  shape?: 'rectangle' | 'circle' | 'text'
  /** Size variant for text shapes */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Rounded corners */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  width: undefined,
  height: undefined,
  shape: 'rectangle',
  size: 'md',
  rounded: 'md',
})

const shapeClasses = computed(() => {
  switch (props.shape) {
    case 'circle':
      return 'rounded-full aspect-square'
    case 'text':
      return 'block'
    case 'rectangle':
    default:
      return 'block'
  }
})

const sizeClasses = computed(() => {
  if (props.shape === 'text') {
    switch (props.size) {
      case 'sm':
        return 'h-3'
      case 'md':
        return 'h-4'
      case 'lg':
        return 'h-5'
      case 'xl':
        return 'h-6'
      default:
        return 'h-4'
    }
  }
  return ''
})

const roundedClasses = computed(() => {
  if (props.shape === 'circle') return ''

  switch (props.rounded) {
    case 'none':
      return 'rounded-none'
    case 'sm':
      return 'rounded-sm'
    case 'md':
      return 'rounded-md'
    case 'lg':
      return 'rounded-lg'
    case 'full':
      return 'rounded-full'
    default:
      return 'rounded-md'
  }
})

const customStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.width) {
    style.width =
      typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  if (props.height) {
    style.height =
      typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  return style
})
</script>

<style scoped>
/* No custom styles needed - using Tailwind classes only */
</style>
