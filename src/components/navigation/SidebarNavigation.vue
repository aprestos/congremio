<template>
  <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div
      class="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4"
    >
      <div class="flex h-16 shrink-0 items-center">
        <img
          class="h-8 w-auto"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
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
                        ? 'text-white'
                        : 'text-indigo-200 group-hover:text-white',
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
            <div class="text-xs/6 font-semibold text-indigo-200">Public</div>
            <ul role="list" class="-mx-2 mt-2 space-y-1">
              <li v-for="page in publicPages" :key="page.id">
                <RouterLink
                  :to="page.to"
                  class="text-indigo-200 hover:bg-indigo-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                >
                  <span
                    class="flex size-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white"
                    >{{ page.initial }}</span
                  >
                  <span class="truncate">{{ page.name }}</span>
                </RouterLink>
              </li>
            </ul>
          </li>
          <li class="-mx-6 mt-auto">
            <a
              href="#"
              class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-indigo-700"
            >
              <span class="sr-only">Your profile</span>
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-400 bg-amber-500 text-[0.625rem] font-medium text-white"
                >F</span
              >
              <span aria-hidden="true">{{ userEmail }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

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
