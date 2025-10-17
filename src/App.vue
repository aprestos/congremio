<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed, watchEffect } from 'vue'

import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

import { useHead } from '@unhead/vue'
import { tenantStore } from './stores/tenant'
import { useDark, useFavicon } from '@vueuse/core'

const icon = useFavicon()
icon.value = tenantStore?.value?.logo || 'assets/logoipsum-381.svg'
const isDark = useDark()

// Computed theme color to match Tailwind's bg-white and bg-gray-950
const themeColor = computed(() => (isDark.value ? '#030712' : '#ffffff'))

// Update theme color reactively for both desktop and mobile
watchEffect(() => {
  // Update theme-color meta tag
  let metaTag = document.querySelector('meta[name="theme-color"]')
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute('name', 'theme-color')
    document.head.appendChild(metaTag)
  }
  metaTag.setAttribute('content', themeColor.value)

  // Update apple-mobile-web-app-status-bar-style for iOS
  let appleMetaTag = document.querySelector(
    'meta[name="apple-mobile-web-app-status-bar-style"]',
  )
  if (!appleMetaTag) {
    appleMetaTag = document.createElement('meta')
    appleMetaTag.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
    document.head.appendChild(appleMetaTag)
  }
  // Use 'default' for light mode and 'black-translucent' for dark mode
  appleMetaTag.setAttribute(
    'content',
    isDark.value ? 'black-translucent' : 'default',
  )
})

useHead({
  title: tenantStore.value?.name || 'congrem.io',
})
</script>

<template>
  <Toaster rich-colors theme="system" position="top-center" />
  <RouterView />
</template>

<style scoped></style>
