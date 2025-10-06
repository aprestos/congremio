<script setup lang="ts">
import { computed } from 'vue'
import { tenantStore } from '@/stores/tenant.ts'
import { useRoute } from 'vue-router'
import { RouteNames } from '@/router/routeNames.ts'
import type { User } from '@supabase/supabase-js'

interface NavigationItem {
  label: string
  icon: unknown
  routeName: string
  enabled: boolean
}

interface PublicPage {
  id: number
  name: string
  to: string | { name: string }
  initial: string
  enabled: boolean
}

const props = defineProps<{
  navigation: NavigationItem[]
  publicPages: PublicPage[]
  user: User | null
}>()

defineEmits<{
  close: []
}>()

// Filter navigation items, separating Settings from main navigation
const mainNavigation = computed(() =>
  props.navigation.filter(
    (item) => item.routeName !== (RouteNames.admin.settings as string),
  ),
)

const settingsItem = computed(() =>
  props.navigation.find(
    (item) => item.routeName === (RouteNames.admin.settings as string),
  ),
)
const route = useRoute()
</script>

<template>
  <div
    class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col dark:bg-gray-900"
  >
    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div
      class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-50 px-6 ring-1 ring-gray-200 dark:bg-black/10 dark:ring-white/5"
    >
      <div class="flex h-16 shrink-0 items-center">
        <!-- Logo SkeletonLoader -->
        <!--        <SkeletonLoader v-if="!tenantStore?.logo" width="128px" height="32px" />-->
        <!-- Actual Logo -->
        <img
          class="h-8 w-auto"
          :src="tenantStore?.logo || '@/assets/logoipsum-381.svg'"
          :alt="tenantStore?.name + ' logo'"
        />
      </div>
      <nav class="flex flex-1 flex-col">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              <li v-for="item in mainNavigation" :key="item.routeName">
                <RouterLink
                  v-if="item.enabled"
                  :to="{ name: item.routeName }"
                  :class="[
                    route.name === item.routeName
                      ? 'bg-gray-100 text-indigo-600 dark:bg-white/5 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white',
                    'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                  ]"
                >
                  <component
                    :is="item.icon"
                    stroke="1.5"
                    :class="[
                      route.name === item.routeName
                        ? 'text-indigo-600 dark:text-white'
                        : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white',
                      'size-6 shrink-0',
                    ]"
                    aria-hidden="true"
                  />
                  {{ item.label }}
                </RouterLink>
              </li>
            </ul>
          </li>
          <li>
            <div
              class="text-xs/6 font-semibold text-gray-500 dark:text-gray-400"
            >
              Public pages
            </div>
            <ul role="list" class="-mx-2 mt-2 space-y-1">
              <li v-for="item in publicPages" :key="item.name">
                <RouterLink
                  v-if="item.enabled"
                  :to="item.to"
                  class="text-gray-700 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                >
                  <span
                    class="border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white/10 dark:group-hover:border-white/20 dark:group-hover:text-white flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-white/5"
                    >{{ item.initial }}</span
                  >
                  <span class="truncate">{{ item.name }}</span>
                </RouterLink>
              </li>
            </ul>
          </li>
          <!-- Settings Section -->
          <li v-if="settingsItem" class="mt-auto">
            <RouterLink
              :to="{ name: settingsItem.routeName }"
              :class="[
                route.name === settingsItem.routeName
                  ? 'bg-gray-100 text-indigo-600 dark:bg-white/5 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white',
                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold -mx-2',
              ]"
            >
              <component
                :is="settingsItem.icon"
                :class="[
                  route.name === settingsItem.routeName
                    ? 'text-indigo-600 dark:text-white'
                    : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white',
                  'size-6 shrink-0',
                ]"
                aria-hidden="true"
              />
              {{ settingsItem.label }}
            </RouterLink>
          </li>

          <!-- Separator -->
          <li class="-mx-6">
            <div class="border-t border-gray-200 dark:border-white/10"></div>
          </li>

          <!-- User Profile -->
          <li class="-mx-6">
            <a
              href="#"
              class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-white/5"
            >
              <div
                class="size-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium uppercase dark:bg-indigo-500"
              >
                {{
                  (user?.user_metadata['display_name'] ?? user?.email)[0] || 'U'
                }}
              </div>
              <div class="flex flex-col">
                <span class="sr-only">Your profile</span>
                <span aria-hidden="true">{{
                  user?.user_metadata['display_name'] ??
                  user?.email?.split('@')[0]
                }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400"
                  >Admin</span
                >
              </div>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped></style>
