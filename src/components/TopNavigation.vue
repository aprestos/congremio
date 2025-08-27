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
                <Popover
                  v-for="category in navigation.categories"
                  :key="category.name"
                  class="flex"
                  v-slot="{ open }"
                >
                  <div class="relative flex">
                    <PopoverButton
                      :class="[
                        open
                          ? 'text-indigo-600'
                          : 'text-gray-700 hover:text-gray-800',
                        'relative flex items-center justify-center text-sm font-medium transition-colors duration-200 ease-out',
                      ]"
                    >
                      {{ category.name }}
                      <span
                        :class="[
                          open ? 'bg-indigo-600' : '',
                          'absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out',
                        ]"
                        aria-hidden="true"
                      />
                    </PopoverButton>
                  </div>
                  <transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <PopoverPanel
                      class="absolute inset-x-0 top-full z-20 w-full bg-white text-gray-500 sm:text-sm"
                    >
                      <!-- Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow -->
                      <div
                        class="absolute inset-0 top-1/2 bg-white shadow-sm"
                        aria-hidden="true"
                      />
                      <div class="relative bg-white">
                        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                          <div
                            class="grid grid-cols-1 items-start gap-x-6 gap-y-10 pt-10 pb-12 md:grid-cols-2 lg:gap-x-8"
                          >
                            <div
                              class="grid grid-cols-1 gap-x-6 gap-y-10 lg:gap-x-8"
                            >
                              <div>
                                <p
                                  id="clothing-heading"
                                  class="font-medium text-gray-900"
                                >
                                  Clothing
                                </p>
                                <div
                                  class="mt-4 border-t border-gray-200 pt-6 sm:grid sm:grid-cols-2 sm:gap-x-6"
                                >
                                  <ul
                                    role="list"
                                    aria-labelledby="clothing-heading"
                                    class="space-y-6 sm:space-y-4"
                                  >
                                    <li
                                      v-for="item in category.clothing[0]"
                                      :key="item.name"
                                      class="flex"
                                    >
                                      <a
                                        :href="item.href"
                                        class="hover:text-gray-800"
                                        >{{ item.name }}</a
                                      >
                                    </li>
                                  </ul>
                                  <ul
                                    role="list"
                                    aria-label="More clothing"
                                    class="mt-6 space-y-6 sm:mt-0 sm:space-y-4"
                                  >
                                    <li
                                      v-for="item in category.clothing[1]"
                                      :key="item.name"
                                      class="flex"
                                    >
                                      <a
                                        :href="item.href"
                                        class="hover:text-gray-800"
                                        >{{ item.name }}</a
                                      >
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div
                              class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:gap-x-8"
                            >
                              <div>
                                <p
                                  id="accessories-heading"
                                  class="font-medium text-gray-900"
                                >
                                  Accessories
                                </p>
                                <ul
                                  role="list"
                                  aria-labelledby="accessories-heading"
                                  class="mt-4 space-y-6 border-t border-gray-200 pt-6 sm:space-y-4"
                                >
                                  <li
                                    v-for="item in category.accessories"
                                    :key="item.name"
                                    class="flex"
                                  >
                                    <a
                                      :href="item.href"
                                      class="hover:text-gray-800"
                                      >{{ item.name }}</a
                                    >
                                  </li>
                                </ul>
                              </div>
                              <div>
                                <p
                                  id="categories-heading"
                                  class="font-medium text-gray-900"
                                >
                                  Categories
                                </p>
                                <ul
                                  role="list"
                                  aria-labelledby="categories-heading"
                                  class="mt-4 space-y-6 border-t border-gray-200 pt-6 sm:space-y-4"
                                >
                                  <li
                                    v-for="item in category.categories"
                                    :key="item.name"
                                    class="flex"
                                  >
                                    <a
                                      :href="item.href"
                                      class="hover:text-gray-800"
                                      >{{ item.name }}</a
                                    >
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverPanel>
                  </transition>
                </Popover>
                <RouterLink
                  v-for="page in navigation"
                  :key="page.name"
                  :to="page.href"
                  class="text-nowrap flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                  >{{ page.name }}</RouterLink
                >
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
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/vue";
import {
  CogIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, ref } from "vue";
import { authService } from "@/features/auth/service.ts";
import { tenantStore } from "@/stores/tenant";

const userEmail = ref<string | null>(null);
const isStaffOrAdmin = ref(false);

// Load user email and check admin role on component mount
onMounted(async () => {
  try {
    const { data } = await authService.getUser();
    if (data.user?.email) {
      userEmail.value = data.user.email;
    }

    // Check if user has staff or admin role
    const isStaff = await authService.hasAdminAccess();
    isStaffOrAdmin.value = isStaff;
  } catch (error) {
    console.error("Error loading user data:", error);
  }
});

const navigation = [
  {
    name: "Library",
    href: "/library",
    current: true,
    categories: [{ name: "Popular" }, { name: "New" }, { name: "All" }],
  },
  { name: "Flee Market", href: "/flee-market", current: false, categories: [] },
  { name: "Tournaments", href: "/tournaments", current: false, categories: [] },
  { name: "Prototypes", href: "/prototypes", current: false, categories: [] },
];

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];
</script>
