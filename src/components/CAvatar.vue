<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  src?: string
  alt?: string
  initials?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'rounded' | 'square'
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  alt: '',
  initials: '?',
  size: 'md',
  shape: 'circle',
})

const hasError = ref(false)
const isLoading = ref(true)

const showFallback = computed(() => !props.src || hasError.value)

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'size-6 text-xs',
    sm: 'size-8 text-sm',
    md: 'size-10 text-base',
    lg: 'size-12 text-lg',
    xl: 'size-16 text-xl',
  }
  return sizes[props.size]
})

const shapeClasses = computed(() => {
  const shapes = {
    circle: 'rounded-full',
    rounded: 'rounded-md',
    square: 'rounded-none',
  }
  return shapes[props.shape]
})

const handleImageError = (): void => {
  hasError.value = true
  isLoading.value = false
}

const handleImageLoad = (): void => {
  isLoading.value = false
  hasError.value = false
}

// Get initials from text (e.g., "John Doe" -> "JD")
const displayInitials = computed(() => {
  if (!props.initials) return '?'

  const words = props.initials.trim().split(/\s+/)
  if (words.length === 1 && words[0]) {
    return words[0].substring(0, 2).toUpperCase()
  }
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
})
</script>

<template>
  <div
    class="relative inline-flex items-center justify-center overflow-hidden"
    :class="[sizeClasses, shapeClasses]"
  >
    <!-- Fallback: Show initials -->
    <div
      v-if="showFallback"
      class="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 font-semibold text-white"
      :class="shapeClasses"
    >
      {{ displayInitials }}
    </div>

    <!-- Image -->
    <img
      v-else
      :src="src"
      :alt="alt"
      class="h-full w-full object-cover"
      :class="[shapeClasses, { 'opacity-0': isLoading }]"
      @error="handleImageError"
      @load="handleImageLoad"
    />

    <!-- Loading skeleton -->
    <div
      v-if="isLoading && !showFallback"
      class="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700"
      :class="shapeClasses"
    />
  </div>
</template>
