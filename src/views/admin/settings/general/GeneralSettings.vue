<template>
  <div class="divide-y divide-gray-200 dark:divide-white/10">
    <TenantSettings />
    <EditionSettings />
    <FeatureSettings />
  </div>
</template>

<script setup lang="ts">
import TenantSettings from './TenantSettings.vue'
import EditionSettings from './EditionSettings.vue'
import FeatureSettings from './FeatureSettings.vue'
</script>
