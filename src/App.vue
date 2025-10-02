<script setup lang="ts">
import { RouterView } from 'vue-router'

import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

import { useHead } from '@unhead/vue'
import { tenantStore } from './stores/tenant'
import { useFavicon } from '@vueuse/core'

useHead({
  title: tenantStore.value?.name || 'congrem.io',
})

const icon = useFavicon()

icon.value = tenantStore?.value?.logo || '@/assets/logoipsum-381.svg' // change current icon
</script>

<template>
  <Toaster rich-colors theme="system" position="top-center" />
  <RouterView />
</template>

<style scoped></style>
