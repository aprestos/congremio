<script setup lang="ts">
import { RouterView } from 'vue-router'

import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

import { useHead } from '@unhead/vue'
import { tenantStore } from './stores/tenant'
import { useFavicon } from '@vueuse/core'

const icon = useFavicon()
icon.value = tenantStore?.value?.logo || 'assets/logoipsum-381.svg'

// Computed theme color from tenant settings
const themeColor = '#4f46e5' // Default to indigo-600

useHead({
  title: tenantStore.value?.name || 'congrem.io',
  meta: [
    {
      name: 'theme-color',
      content: themeColor,
    },
  ],
})
</script>

<template>
  <Toaster rich-colors theme="system" position="top-center" />
  <RouterView />
</template>

<style scoped></style>
