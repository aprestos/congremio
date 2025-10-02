<template>
  <SidebarNavigationGrey
    :sidebar-open="sidebarOpen"
    :navigation="navigation"
    :public-pages="publicPages"
    :user-email="userEmail"
    @close="sidebarOpen = false"
  />

  <div class="lg:pl-72 bg-white dark:bg-gray-900 dark:border-white/5">
    <div>
      <router-view />
    </div>
  </div>
  <!-- component -->

  <BottomNavBar :navigation="navigation" />
</template>

<script setup lang="ts">
import {
  BuildingLibraryIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  HomeIcon,
  TrophyIcon,
} from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'
import BottomNavBar from '@/components/navigation/BottomNavBar.vue'
import SidebarNavigationGrey from '@/components/navigation/SidebarNavigationGrey.vue'
import { authService } from '@/features/auth/service.ts'
import { RouteNames } from '@/router/routeNames.ts'
import { settingsStore } from '@/features/settings/useSettings.store.ts'

const userEmail = ref<string | null>(null)

// Load user email on component mount
onMounted(async () => {
  try {
    const { data } = await authService.getUser()
    if (data.user?.email) {
      userEmail.value = data.user.email
    }
  } catch (error) {
    console.error('Error loading user email:', error)
  }
})

const navigation = ref([
  {
    label: 'Dashboard',
    routeName: RouteNames.admin.dashboard as string,
    icon: HomeIcon,
    enabled: true,
  },
  {
    label: 'Library',
    routeName: RouteNames.admin.library as string,
    icon: BuildingLibraryIcon,
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
    icon: TrophyIcon,
    enabled: settingsStore?.value?.tournaments?.enabled ?? false,
  },
  {
    label: 'Settings',
    routeName: RouteNames.admin.settings as string,
    icon: Cog6ToothIcon,
    enabled: true,
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
</script>
