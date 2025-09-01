<template>
  <div class="bg-white">
    <header class="relative bg-white">
      <nav aria-label="Top" class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="border-b border-gray-200 px-4 pb-14 sm:px-0 sm:pb-0">
          <div class="flex h-16 items-center justify-between">
            <!-- Logo -->
            <div class="flex flex-1">
              <a href="#">
                <span class="sr-only">Your Company</span>
                <img
                  class="h-8 w-auto"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
            </div>

            <!-- Flyout menus -->
            <PopoverGroup
              class="absolute inset-x-0 bottom-0 sm:static sm:flex-1 sm:self-stretch"
            >
              <div
                class="flex h-14 space-x-8 overflow-x-auto border-t border-gray-200 px-4 pb-px sm:h-full sm:justify-center sm:overflow-visible sm:border-t-0 sm:pb-0"
              >
                <RouterLink
                  v-for="page in navigation"
                  :key="page.name"
                  :to="page.href"
                  class="text-nowrap flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  {{ page.name }}
                </RouterLink>
              </div>
            </PopoverGroup>

            <div class="flex flex-1 items-center justify-end">
              <!-- Admin Panel Button (only show if user is staff or admin) -->
              <RouterLink
                v-if="isStaffOrAdmin"
                to="/admin"
                class="ml-4 flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <CogIcon class="h-4 w-4" aria-hidden="true" />
                Admin Panel
              </RouterLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  </div>
</template>

<script setup lang="ts">
import { PopoverGroup } from '@headlessui/vue'
import { CogIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'
import { authService } from '@/features/auth/service.ts'

const userEmail = ref<string | null>(null)
const isStaffOrAdmin = ref(false)

// Load user email and check admin role on component mount
onMounted(async () => {
  try {
    const { data } = await authService.getUser()
    if (data.user?.email) {
      userEmail.value = data.user.email
    }

    // Check if user has staff or admin role
    const isStaff = await authService.hasAdminAccess()
    isStaffOrAdmin.value = isStaff
  } catch (error) {
    console.error('Error loading user data:', error)
  }
})

interface Category {
  name: string
}

interface NavigationItem {
  name: string
  href: string
  current: boolean
  categories: Category[]
}

const navigation: NavigationItem[] = [
  {
    name: 'Library',
    href: '/library',
    current: true,
    categories: [{ name: 'Popular' }, { name: 'New' }, { name: 'All' }],
  },
  { name: 'Flee Market', href: '/flee-market', current: false, categories: [] },
  { name: 'Tournaments', href: '/tournaments', current: false, categories: [] },
  { name: 'Prototypes', href: '/prototypes', current: false, categories: [] },
]
</script>
