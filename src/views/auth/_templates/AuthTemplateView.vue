<template>
  <div
    class="flex bg-gray-100 min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <!-- Logo outside the card -->
    <img
      class="mx-auto h-10 w-auto"
      src="@/assets/logo-horizontal-color.svg"
      alt="Your Company"
    />

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg sm:px-8"
      >
        <!-- Content Slot -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Auth template component - provides common layout structure for all auth pages
</script>
