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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BottomNavBar from '@/components/navigation/BottomNavBar.vue'
import SidebarNavigationGrey from '@/components/navigation/SidebarNavigationGrey.vue'
import { authService } from '@/features/auth/service.ts'
import { RouteNames } from '@/router/routeNames.ts'

const route = useRoute()
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

const navigation = computed(() => [
  {
    name: 'Dashboard',
    to: { name: RouteNames.admin.dashboard },
    icon: HomeIcon,
    current: route.name === RouteNames.admin.dashboard,
  },
  {
    name: 'Library',
    to: { name: RouteNames.admin.library },
    icon: BuildingLibraryIcon,
    current: route.name === RouteNames.admin.library,
  },
  {
    name: 'Events',
    to: { name: RouteNames.admin.events },
    icon: CalendarDaysIcon,
    current: route.name === RouteNames.admin.events,
  },
  {
    name: 'Tournaments',
    to: { name: RouteNames.admin.tournaments },
    icon: TrophyIcon,
    current: route.name === RouteNames.admin.tournaments,
  },
  {
    name: 'Settings',
    to: { name: RouteNames.admin.settings },
    icon: Cog6ToothIcon,
    current: route.name === RouteNames.admin.settings,
  },
])
const publicPages = [
  {
    id: 1,
    name: 'Library',
    to: { name: RouteNames.public.library },
    initial: 'L',
    current: false,
  },
  {
    id: 2,
    name: 'Flee Market',
    to: { name: RouteNames.public.fleeMarket },
    initial: 'FM',
    current: false,
  },
]

const sidebarOpen = ref(false)
</script>
