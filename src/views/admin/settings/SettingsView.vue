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
          <RouterLink
            :to="{ name: item.routeName }"
            :class="[
              route.name === item.routeName
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'hover:text-gray-700 dark:hover:text-gray-300',
            ]"
            >{{ item.name }}</RouterLink
          >
        </li>
      </ul>
    </nav>
  </header>

  <!-- Settings forms -->
  <div class="divide-y divide-gray-200 dark:divide-white/10">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { RouteNames } from '@/router/routeNames'

const route = useRoute()

const secondaryNavigation = [
  {
    name: 'General',
    to: { name: RouteNames.admin.settingsGeneral },
    routeName: RouteNames.admin.settingsGeneral,
  },
  {
    name: 'Library',
    to: { name: RouteNames.admin.settingsLibrary },
    routeName: RouteNames.admin.settingsLibrary,
  },
]
</script>
