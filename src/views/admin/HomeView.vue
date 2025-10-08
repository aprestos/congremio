<template>
  <SidebarNavigationGrey
    :sidebar-open="sidebarOpen"
    :top-navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :public-pages="publicPages"
    :user="user"
    @close="sidebarOpen = false"
  />

  <div
    class="lg:pl-72 bg-white dark:bg-gray-900 dark:border-white/5 h-screen flex flex-col"
  >
    <div class="flex-1 overflow-auto min-h-0">
      <router-view />
    </div>
  </div>
  <!-- component -->

  <BottomNavBar :navigation="navigation" />
</template>

<script setup lang="ts">
import { CalendarDaysIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'
import BottomNavBar from '@/components/navigation/BottomNavBar.vue'
import SidebarNavigationGrey from '@/components/navigation/SidebarNavigationGrey.vue'
import { authService } from '@/features/auth/service.ts'
import { RouteNames } from '@/router/routeNames.ts'
import { settingsStore } from '@/features/settings/useSettings.store.ts'
import {
  IconBooks,
  IconHome,
  IconTrophy,
  IconSettings,
} from '@tabler/icons-vue'
import type { User } from '@supabase/supabase-js'

const userEmail = ref<string | null>(null)
const user = ref<User | null>(null)

const navigation = ref([
  {
    label: 'Dashboard',
    routeName: RouteNames.admin.dashboard as string,
    icon: IconHome,
    enabled: false,
  },
  {
    label: 'Library',
    routeName: RouteNames.admin.library as string,
    icon: IconBooks,
    enabled: settingsStore?.value?.library?.enabled ?? false,
  },
  {
    label: 'Events',
    routeName: RouteNames.admin.events as string,
    icon: CalendarDaysIcon,
    enabled: settingsStore?.value?.events?.enabled ?? false,
  },
  {
    label: 'Tournaments',
    routeName: RouteNames.admin.tournaments as string,
    icon: IconTrophy,
    enabled: settingsStore?.value?.tournaments?.enabled ?? false,
  },
])

const bottomNavigation = ref([
  {
    label: 'Settings',
    routeName: RouteNames.admin.settings as string,
    icon: IconSettings,
    enabled: false, // Will be set in onMounted
  },
])

const publicPages = [
  {
    id: 1,
    name: 'Library',
    to: { name: RouteNames.public.library },
    initial: 'L',
    enabled: settingsStore?.value?.library?.enabled ?? false,
  },
  {
    id: 2,
    name: 'Flea Market',
    to: { name: RouteNames.public.fleeMarket },
    initial: 'FM',
    enabled: settingsStore?.value?.flea?.enabled ?? false,
  },
]

const sidebarOpen = ref(false)

// Load user email on component mount
onMounted(async () => {
  try {
    // Execute both async operations in parallel
    const [{ data }, isAdmin] = await Promise.all([
      authService.getUser(),
      authService.isAdminOrHigher(),
    ])

    if (data.user) {
      userEmail.value = data.user?.email || null
      user.value = data.user
    }

    // Set bottom navigation enabled state based on user role
    bottomNavigation.value[0].enabled = isAdmin
  } catch (error) {
    console.error('Error loading user email:', error)
  }
})
</script>
