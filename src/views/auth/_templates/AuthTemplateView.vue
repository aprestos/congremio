<template>
  <div class="min-h-screen px-6 py-12 lg:px-8">
    <div class="px-6 py-12 lg:px-8">
      <div class="">
        <img
          class="dark:hidden mx-auto h-10 w-auto"
          src="@/assets/logo-horizontal-color.svg"
          alt="congrem.io"
        />
        <img
          class="hidden dark:block mx-auto h-10 w-auto"
          src="@/assets/logo-horizontal-white.svg"
          alt="congrem.io"
        />
      </div>
    </div>

    <!-- Logo outside the card -->

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="md:px-6 py-8 md:shadow-sm md:ring-1 md:ring-gray-900/5 dark:ring-white/10 sm:rounded-lg sm:px-8"
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
