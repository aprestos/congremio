<template>
  <div class="pb-64">
    <div>
      <!-- Mobile filter dialog -->
      <TransitionRoot as="template" :show="mobileFiltersOpen">
        <Dialog
          class="relative z-40 lg:hidden"
          @close="mobileFiltersOpen = false"
        >
          <TransitionChild
            as="template"
            enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0"
            enter-to=""
            leave="transition-opacity ease-linear duration-300"
            leave-from=""
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div class="fixed inset-0 z-40 flex">
            <TransitionChild
              as="template"
              enter="transition ease-in-out duration-300 transform"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel
                class="relative ml-auto flex size-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-gray-800 pt-4 pb-6 shadow-xl"
              >
                <div class="flex items-center justify-between px-4">
                  <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                    Filters
                  </h2>
                  <button
                    type="button"
                    class="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white dark:bg-gray-800 p-2 text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    @click="mobileFiltersOpen = false"
                  >
                    <span class="absolute -inset-0.5" />
                    <span class="sr-only">Close menu</span>
                    <XMarkIcon class="size-6" aria-hidden="true" />
                  </button>
                </div>

                <!-- Filters -->
                <form
                  class="mt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <h3 class="sr-only">Categories</h3>
                  <ul
                    role="list"
                    class="px-2 py-3 font-medium text-gray-900 dark:text-white"
                  >
                    <li v-for="category in subCategories" :key="category.name">
                      <label
                        class="flex items-center gap-2 px-2 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        :class="{
                          'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300':
                            selectedTag === category.name,
                        }"
                      >
                        <component
                          :is="category.icon"
                          class="h-5 w-5 text-gray-400 dark:text-gray-300"
                          :class="{
                            'text-indigo-600 dark:text-indigo-400':
                              selectedTag === category.name,
                          }"
                        />
                        <span class="flex-1" @click="selectTag(category.name)">
                          {{ category.name }}
                        </span>
                      </label>
                    </li>
                  </ul>

                  <Disclosure
                    v-for="section in filters"
                    :key="section.id"
                    v-slot="{ open }"
                    as="div"
                    class="border-t border-gray-200 dark:border-gray-700 px-4 py-6"
                  >
                    <h3 class="-mx-2 -my-3 flow-root">
                      <DisclosureButton
                        class="flex w-full items-center justify-between bg-white dark:bg-gray-800 px-2 py-3 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                      >
                        <span
                          class="font-medium text-gray-900 dark:text-white"
                          >{{ section.name }}</span
                        >
                        <span class="ml-6 flex items-center">
                          <PlusIcon
                            v-if="!open"
                            class="size-5"
                            aria-hidden="true"
                          />
                          <MinusIcon v-else class="size-5" aria-hidden="true" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel class="pt-6">
                      <div class="space-y-6">
                        <div
                          v-for="(option, optionIdx) in section.options"
                          :key="option.value"
                          class="flex gap-3"
                        >
                          <div class="flex h-5 shrink-0 items-center">
                            <div class="group grid size-4 grid-cols-1">
                              <input
                                :id="`filter-mobile-${section.id}-${optionIdx}`"
                                :name="`${section.id}[]`"
                                :value="option.value"
                                type="checkbox"
                                :checked="
                                  isFilterSelected(section.id, option.value)
                                "
                                class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                @change="
                                  toggleFilter(section.id, option.value, $event)
                                "
                              />
                              <svg
                                class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                viewBox="0 0 14 14"
                                fill="none"
                              >
                                <path
                                  class="opacity-0 group-has-checked:opacity-100"
                                  d="M3 8L6 11L11 3.5"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  class="opacity-0 group-has-indeterminate:opacity-100"
                                  d="M3 7H11"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                          <label
                            :for="`filter-mobile-${section.id}-${optionIdx}`"
                            class="min-w-0 flex-1 text-gray-500 dark:text-gray-400"
                            >{{ option.label }}</label
                          >
                        </div>
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>

      <main>
        <div class="flex items-baseline justify-between pb-6">
          <!-- Search Input -->
          <div class="flex-1 mr-6">
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <MagnifyingGlassIcon
                  class="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search games..."
                class="block w-full pl-12 pr-3 py-4 text-lg bg-gray-100 dark:border-gray-600 rounded-full dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              />
            </div>
          </div>

          <div class="hidden flex items-center">
            <Listbox v-model="selectedSort">
              <div class="relative">
                <ListboxButton
                  class="group flex flex-col items-start bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 min-w-[120px]"
                >
                  <div class="flex items-center justify-between w-full">
                    <span class="text-xs text-gray-500 dark:text-gray-400"
                      >Sort by</span
                    >
                    <ChevronDownIcon
                      class="size-4 shrink-0 text-gray-400 dark:text-gray-300"
                      aria-hidden="true"
                    />
                  </div>
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{
                      selectedSort
                        ? sortOptions.find((opt) => opt.id === selectedSort)
                            ?.name
                        : 'Best Rating'
                    }}
                  </span>
                </ListboxButton>

                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <ListboxOptions
                    class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-gray-700 focus:outline-none"
                  >
                    <div class="py-1">
                      <ListboxOption
                        v-for="option in sortOptions"
                        :key="option.id"
                        v-slot="{ active, selected }"
                        :value="option.id"
                      >
                        <div
                          :class="[
                            selected
                              ? 'font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700'
                              : 'text-gray-500 dark:text-gray-400',
                            active ? 'bg-gray-100 dark:bg-gray-600' : '',
                            'block px-4 py-2 text-sm cursor-pointer',
                          ]"
                        >
                          {{ option.name }}
                        </div>
                      </ListboxOption>
                    </div>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>

            <button
              type="button"
              class="-m-2 ml-4 p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 sm:ml-6 lg:hidden"
              @click="mobileFiltersOpen = true"
            >
              <span class="sr-only">Filters</span>
              <FunnelIcon class="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" class="">
          <h2 id="products-heading" class="sr-only">Products</h2>

          <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <!-- Filters -->
            <form class="hidden lg:block">
              <h3 class="sr-only">Categories</h3>
              <ul
                role="list"
                class="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-6 text-sm font-medium text-gray-900 dark:text-white"
              >
                <li v-for="category in subCategories" :key="category.name">
                  <label
                    class="flex items-center gap-2 cursor-pointer hover:text-indigo-200 dark:hover:text-indigo-300"
                    :class="{
                      'text-indigo-600 dark:text-indigo-400':
                        selectedTag === category.name,
                    }"
                  >
                    <component
                      :is="category.icon"
                      class="h-4 w-4 text-gray-400 dark:text-gray-300"
                      :class="{
                        'text-indigo-600 dark:text-indigo-400':
                          selectedTag === category.name,
                      }"
                    />
                    <span class="flex-1" @click="selectTag(category.name)">
                      {{ category.name }}
                    </span>
                  </label>
                </li>
              </ul>

              <Disclosure
                v-for="section in filters"
                :key="section.id"
                v-slot="{ open }"
                as="div"
                class="border-b border-gray-200 dark:border-gray-700 py-6"
              >
                <h3 class="-my-3 flow-root">
                  <DisclosureButton
                    class="flex w-full items-center justify-between bg-white dark:bg-gray-900 py-3 text-sm text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                  >
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      section.name
                    }}</span>
                    <span class="ml-6 flex items-center">
                      <PlusIcon
                        v-if="!open"
                        class="size-5"
                        aria-hidden="true"
                      />
                      <MinusIcon v-else class="size-5" aria-hidden="true" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel class="pt-6">
                  <div class="space-y-4">
                    <div
                      v-for="(option, optionIdx) in section.options"
                      :key="option.value"
                      class="flex gap-3"
                    >
                      <div class="flex h-5 shrink-0 items-center">
                        <div class="group grid size-4 grid-cols-1">
                          <input
                            :id="`filter-${section.id}-${optionIdx}`"
                            :name="`${section.id}[]`"
                            :value="option.value"
                            type="checkbox"
                            :checked="
                              isFilterSelected(section.id, option.value)
                            "
                            class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                            @change="
                              toggleFilter(section.id, option.value, $event)
                            "
                          />
                          <svg
                            class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              class="opacity-0 group-has-checked:opacity-100"
                              d="M3 8L6 11L11 3.5"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              class="opacity-0 group-has-indeterminate:opacity-100"
                              d="M3 7H11"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <label
                        :for="`filter-${section.id}-${optionIdx}`"
                        class="text-sm text-gray-600 dark:text-gray-400"
                        >{{ option.label }}</label
                      >
                    </div>
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </form>

            <div class="lg:col-span-3">
              <GameList :filters="currentFilters" />
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- Sticky bottom container -->
    <div
      class="fixed bottom-0 left-0 right-0 p-4 flex items-center justify-center"
    >
      <ReservationList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconPlayCard2Filled } from '@tabler/icons-vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import GameList from '@/views/library/GameList.vue'
import ReservationList from '@/views/library/ReservationList.vue'
import type { FilterOptions } from '@/features/library/service.ts'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  UserGroupIcon,
  TrophyIcon,
} from '@heroicons/vue/20/solid'

const searchQuery = ref('')
const selectedFilters = ref<Record<string, string[]>>({})
const selectedTag = ref<string>('')
const selectedSort = ref('rating')

// Computed property to create the proper filter structure
const currentFilters = computed((): FilterOptions => {
  // Remove empty arrays from selectedFilters
  const cleanedFilters = Object.fromEntries(
    Object.entries(selectedFilters.value).filter(
      ([, values]) => values.length > 0,
    ),
  )

  // Add selected tag to filters if one is selected
  if (selectedTag.value) {
    cleanedFilters.tags = [selectedTag.value]
  }

  return {
    searchQuery: searchQuery.value || undefined,
    selectedFilters:
      Object.keys(cleanedFilters).length > 0 ? cleanedFilters : undefined,
  }
})

const sortOptions = [
  { name: 'Best Rating', id: 'rating', current: false },
  { name: 'Newest', id: 'newest', current: false },
  { name: 'Name', id: 'name', current: false },
]
const subCategories = [
  { name: 'New arrivals', href: '#', icon: SparklesIcon },
  { name: 'Family', href: '#', icon: UserGroupIcon },
  { name: 'Classics', href: '#', icon: TrophyIcon },
  { name: '2-player only', href: '#', icon: IconPlayCard2Filled },
]
const filters = [
  {
    id: 'players',
    name: 'Number of Players',
    options: [
      { value: '1', label: '1', checked: false },
      { value: '2', label: '2', checked: false },
      { value: '3', label: '3', checked: true },
      { value: '4', label: '4', checked: false },
      { value: '5', label: '5', checked: false },
      { value: '6', label: '6', checked: false },
      { value: '7', label: '7', checked: false },
      { value: '8', label: '8', checked: false },
      { value: '9', label: '9', checked: false },
      { value: '10+', label: '10+', checked: false },
    ],
  },
  {
    id: 'playtime',
    name: 'Playtime',
    options: [
      { value: '15', label: '15 min', checked: false },
      { value: '30', label: '30 min', checked: false },
      { value: '60', label: '60 min', checked: false },
      { value: '90', label: '90 min', checked: false },
      { value: '120', label: '120 min', checked: false },
      { value: '180', label: '180 min', checked: false },
      { value: '240', label: '240 min', checked: false },
    ],
  },
]

const mobileFiltersOpen = ref(false)

// Tag management functions
const selectTag = (tagName: string): void => {
  if (selectedTag.value === tagName) {
    // Deselect if clicking the same tag
    selectedTag.value = ''
  } else {
    // Select the new tag
    selectedTag.value = tagName
  }
}

// Filter management functions
const isFilterSelected = (sectionId: string, value: string): boolean => {
  return selectedFilters.value[sectionId]?.includes(value) || false
}

const toggleFilter = (sectionId: string, value: string, event: Event): void => {
  const target = event.target as HTMLInputElement

  if (!selectedFilters.value[sectionId]) {
    selectedFilters.value[sectionId] = []
  }

  if (target.checked) {
    // Add filter
    if (!selectedFilters.value[sectionId].includes(value)) {
      selectedFilters.value[sectionId].push(value)
    }
  } else {
    // Remove filter
    const index = selectedFilters.value[sectionId].indexOf(value)
    if (index > -1) {
      selectedFilters.value[sectionId].splice(index, 1)
    }
  }
}
</script>
