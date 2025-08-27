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
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import {
  Bars3Icon,
  BellIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  CalendarIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import BottomNavBar from "@/components/navigation/BottomNavBar.vue";
import SidebarNavigation from "@/components/navigation/SidebarNavigation.vue";
import SidebarNavigationGrey from "@/components/navigation/SidebarNavigationGrey.vue";
import { useSearch } from "@/composables/useSearch.ts";
import { authService } from "@/features/auth/service.ts";
import { navigationGuard } from "@/router/guards.ts";
import { RouteNames } from "@/router/routeNames.ts";

const route = useRoute();
const userEmail = ref<string | null>(null);
const searchInput = ref("");
const { executeSearch } = useSearch();

// Load user email on component mount
onMounted(async () => {
  try {
    const { data } = await authService.getUser();
    if (data.user?.email) {
      userEmail.value = data.user.email;
    }
  } catch (error) {
    console.error("Error loading user email:", error);
  }
});

const navigation = computed(() => [
  {
    name: "Dashboard",
    to: { name: RouteNames.admin.dashboard },
    icon: HomeIcon,
    current: route.name === RouteNames.admin.dashboard,
  },
  {
    name: "Library",
    to: { name: RouteNames.admin.library },
    icon: BuildingLibraryIcon,
    current: route.name === RouteNames.admin.library,
  },
  {
    name: "Events",
    to: { name: RouteNames.admin.events },
    icon: CalendarDaysIcon,
    current: route.name === RouteNames.admin.events,
  },
  {
    name: "Tournaments",
    to: { name: RouteNames.admin.tournaments },
    icon: TrophyIcon,
    current: route.name === RouteNames.admin.tournaments,
  },
  {
    name: "Settings",
    to: { name: RouteNames.admin.settings },
    icon: Cog6ToothIcon,
    current: route.name === RouteNames.admin.settings,
  },
]);
const publicPages = [
  {
    id: 1,
    name: "Library",
    to: { name: RouteNames.public.library },
    initial: "L",
  },
  {
    id: 2,
    name: "Flee Market",
    to: { name: RouteNames.public.fleeMarket },
    initial: "FM",
  },
];
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

const sidebarOpen = ref(false);

function handleSearchInput() {
  // Optional: Handle real-time search as user types
  if (searchInput.value.length > 2) {
    executeSearch(searchInput.value);
  }
}

function handleSearch() {
  // Handle search form submission
  executeSearch(searchInput.value);
}
</script>
