<script setup lang="ts">
import { RouterView } from "vue-router";
//import "vue3-toastify/dist/index.css";

import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
</script>

<template>
  <Toaster richColors theme="system" position="top-center" />
  <RouterView />
</template>

<style scoped></style>
