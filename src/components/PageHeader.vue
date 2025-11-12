<script setup lang="ts">
interface Props {
  title: string
  description?: string
  actionLabel?: string
}

interface Emits {
  (e: 'action'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleAction = (): void => {
  emit('action')
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="mt-1 text-sm text-gray-500 dark:text-gray-400"
      >
        {{ description }}
      </p>
    </div>
    <button
      v-if="actionLabel"
      class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 transition-colors"
      @click="handleAction"
    >
      <slot name="action-icon" />
      {{ actionLabel }}
    </button>
  </div>
</template>
