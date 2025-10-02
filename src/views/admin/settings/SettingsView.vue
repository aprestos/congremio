<template>
  <h1 class="sr-only">Account Settings</h1>

  <header class="border-b border-gray-200 dark:border-white/5">
    <!-- Secondary navigation -->
    <nav class="flex overflow-x-auto py-4">
      <ul
        role="list"
        class="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-500 sm:px-6 lg:px-8 dark:text-gray-400"
      >
        <li v-for="item in secondaryNavigation" :key="item.name">
          <a
            :href="item.href"
            :class="item.current ? 'text-indigo-600 dark:text-indigo-400' : ''"
            >{{ item.name }}</a
          >
        </li>
      </ul>
    </nav>
  </header>

  <!-- Settings forms -->
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

const secondaryNavigation = [
  { name: 'General', href: '#', current: true },
  { name: 'Editions', href: '#', current: false },
  { name: 'Library', href: '#', current: false },
]
</script>
