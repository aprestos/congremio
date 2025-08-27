<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

import { Cog6ToothIcon, XMarkIcon } from "@heroicons/vue/24/outline";

interface NavigationItem {
  name: string;
  to: string | { name: string };
  icon: unknown;
  current: boolean;
}

interface PublicPage {
  id: number;
  name: string;
  to: string | { name: string };
  initial: string;
}

defineProps<{
  sidebarOpen: boolean;
  navigation: NavigationItem[];
  publicPages: PublicPage[];
  userEmail: string | null;
}>();

defineEmits<{
  close: [];
}>();
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
        <img
          class="h-8 w-auto dark:hidden"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <img
          class="h-8 w-auto not-dark:hidden"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
        />
      </div>
      <nav class="flex flex-1 flex-col">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              <li v-for="item in navigation" :key="item.name">
                <RouterLink
                  :to="item.to"
                  :class="[
                    item.current
                      ? 'bg-gray-100 text-indigo-600 dark:bg-white/5 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white',
                    'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                  ]"
                >
                  <component
                    :is="item.icon"
                    :class="[
                      item.current
                        ? 'text-indigo-600 dark:text-white'
                        : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white',
                      'size-6 shrink-0',
                    ]"
                    aria-hidden="true"
                  />
                  {{ item.name }}
                </RouterLink>
              </li>
            </ul>
          </li>
          <li>
            <div
              class="text-xs/6 font-semibold text-gray-500 dark:text-gray-400"
            >
              Your teams
            </div>
            <ul role="list" class="-mx-2 mt-2 space-y-1">
              <li v-for="item in publicPages" :key="item.name">
                <RouterLink
                  :to="item.to"
                  :class="[
                    item.current
                      ? 'bg-gray-100 text-indigo-600 dark:bg-white/5 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white',
                    'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                  ]"
                >
                  <span
                    :class="[
                      item.current
                        ? 'border-indigo-600 text-indigo-600 dark:border-white/20 dark:text-white'
                        : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white/10 dark:group-hover:border-white/20 dark:group-hover:text-white',
                      'flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-white/5',
                    ]"
                    >{{ item.initial }}</span
                  >
                  <span class="truncate">{{ item.name }}</span>
                </RouterLink>
              </li>
            </ul>
          </li>
          <li class="-mx-6 mt-auto">
            <a
              href="#"
              class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-white/5"
            >
              <div
                class="size-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium uppercase dark:bg-indigo-500"
              >
                {{ userEmail?.[0] || "U" }}
              </div>
              <div class="flex flex-col">
                <span class="sr-only">Your profile</span>
                <span aria-hidden="true">{{ userEmail?.split("@")[0] }}</span>
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
