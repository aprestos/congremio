<template>
  <div class="min-h-full bg-white dark:bg-gray-900">
    <TopNavigation />

    <div class="py-10">
      <main>
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <slot name="default" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNavigation from '@/components/TopNavigation.vue'

defineProps({})
</script>
