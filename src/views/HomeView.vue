<template>
  <div class="min-h-screen">
    <TopNavigation />

    <div>
      <main>
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNavigation from '@/components/TopNavigation.vue'

defineProps({})
</script>
