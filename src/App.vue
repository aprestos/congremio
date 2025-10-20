<script setup lang="ts">
import { RouterView } from 'vue-router'

import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

import { useHead } from '@unhead/vue'
import { tenantStore } from './stores/tenant'
import { useFavicon } from '@vueuse/core'

if (tenantStore?.value?.logo) {
  const icon = useFavicon()
  icon.value = tenantStore?.value?.logo
}

useHead({
  title: tenantStore.value?.name || 'congrem.io',
})
</script>

<template>
  <Toaster rich-colors theme="system" position="top-center" />
  <RouterView />
</template>

<style scoped></style>
