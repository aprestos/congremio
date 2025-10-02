<template>
  <div class="relative inline-flex items-center justify-center">
    <svg
      :width="size"
      :height="size"
      class="transform -rotate-90"
      viewBox="0 0 100 100"
    >
      <!-- Background circle -->
      <circle
        cx="50"
        cy="50"
        :r="radius"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        fill="transparent"
        class="text-gray-200 dark:text-gray-700"
      />

      <!-- Progress circle -->
      <circle
        cx="50"
        cy="50"
        :r="radius"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        fill="transparent"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        :class="progressColor"
        class="transition-all duration-1000 ease-linear"
        stroke-linecap="round"
      />
    </svg>

    <!-- Content inside circle -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="text-center">
        <div
          :class="textSize"
          class="font-bold text-gray-900 dark:text-white leading-none"
        >
          {{ displayTime }}
        </div>
        <div
          v-if="showLabel"
          class="text-xs text-gray-500 dark:text-gray-400 mt-1"
        >
          {{ label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'

interface Props {
  time: number // Time remaining in milliseconds
  totalTime?: number // Total time for calculating percentage (default: 4 minutes)
  size?: number // SVG size in pixels
  strokeWidth?: number // Stroke width of the circle
  showLabel?: boolean // Show label below time
  label?: string // Custom label text
  format?: 'mm:ss' | 'hh:mm' | 'auto' // Time display format
}

const props = withDefaults(defineProps<Props>(), {
  totalTime: 4 * 60 * 1000, // 4 minutes in milliseconds
  size: 80,
  strokeWidth: 8,
  showLabel: true,
  label: 'remaining',
  format: 'auto',
})

const timeRemaining = ref(Math.max(0, props.time))
let intervalId: number | null = null

// Calculate circle properties
const radius = computed(() => (100 - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

// Calculate progress percentage (0-100)
const progressPercentage = computed(() => {
  if (props.totalTime <= 0) return 0
  return Math.max(
    0,
    Math.min(100, (timeRemaining.value / props.totalTime) * 100),
  )
})

// Calculate stroke dash offset for progress
const strokeDashoffset = computed(() => {
  const progress = progressPercentage.value / 100
  return circumference.value * (1 - progress)
})

// Dynamic text size based on circle size
const textSize = computed(() => {
  if (props.size <= 60) return 'text-xs'
  if (props.size <= 80) return 'text-sm'
  if (props.size <= 100) return 'text-base'
  return 'text-lg'
})

// Progress color based on time remaining
const progressColor = computed(() => {
  const percentage = progressPercentage.value

  if (percentage > 50) {
    return 'text-green-500'
  } else if (percentage > 25) {
    return 'text-yellow-500'
  } else if (percentage > 10) {
    return 'text-orange-500'
  } else {
    return 'text-red-500'
  }
})

// Format time display
const displayTime = computed(() => {
  const totalSeconds = Math.ceil(timeRemaining.value / 1000)

  if (totalSeconds <= 0) return '00:00'

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  if (props.format === 'hh:mm') {
    return `${formatNumber(hours)}:${formatNumber(minutes)}`
  } else if (props.format === 'mm:ss') {
    const totalMinutes = Math.floor(totalSeconds / 60)
    return `${formatNumber(totalMinutes)}:${formatNumber(seconds)}`
  } else {
    // Auto format - for 4 minute countdown, always show mm:ss
    return `${formatNumber(minutes)}:${formatNumber(seconds)}`
  }
})

// Update countdown every second
const startCountdown = () => {
  if (intervalId) clearInterval(intervalId)

  intervalId = window.setInterval(() => {
    timeRemaining.value = Math.max(0, timeRemaining.value - 1000)

    if (timeRemaining.value <= 0) {
      clearInterval(intervalId!)
      intervalId = null
    }
  }, 1000)
}

// Watch for prop changes
watch(
  () => props.time,
  (newTime) => {
    timeRemaining.value = Math.max(0, newTime)

    if (newTime > 0) {
      startCountdown()
    } else if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  },
  { immediate: true },
)

// Start countdown on mount if time > 0
if (props.time > 0) {
  startCountdown()
}

// Cleanup on unmount
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
/* Ensure smooth animation transitions */
svg circle {
  transition-property: stroke-dashoffset, stroke;
  transition-timing-function: ease-linear;
}
</style>
