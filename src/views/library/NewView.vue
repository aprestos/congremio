<template>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div>
      <nav class="sm:hidden" aria-label="Back">
        <a href="#" class="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
          <ChevronLeftIcon class="mr-1 -ml-1 size-5 shrink-0 text-gray-400" aria-hidden="true" />
          Back
        </a>
      </nav>
      <nav class="hidden sm:flex" aria-label="Breadcrumb">
        <ol role="list" class="flex items-center space-x-4">
          <li>
            <div class="flex">
              <RouterLink
                to="/library"
                class="text-sm font-medium text-gray-500 hover:text-gray-700"
                >Library</RouterLink
              >
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <ChevronRightIcon class="size-5 shrink-0 text-gray-400" aria-hidden="true" />
              <a href="#" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">New</a>
            </div>
          </li>
        </ol>
      </nav>
    </div>
    <div class="mt-2 md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Create a Library Game
        </h2>
      </div>
      <div class="mt-4 flex shrink-0 md:mt-0 md:ml-4">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click.prevent="submit"
          type="button"
          class="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
  <form>
    <div class="space-y-12 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="pb-12">
        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="col-span-full">
            <label for="cover-photo" class="block text-sm/6 font-medium text-gray-900">Game</label>
            <div
              class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
              v-if="!selectedGame?.name"
            >
              <div class="text-center">
                <p class="text-xs/5 text-gray-600">No game selected</p>
                <div class="mt-4 flex text-sm/6 text-gray-600">
                  <a
                    v-on:click="dialogOpen = true"
                    class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                    >Search games</a
                  >
                </div>
              </div>
            </div>
            <div
              v-if="selectedGame?.name"
              class="overflow-hidden rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300"
            >
              <div class="px-4 py-5 sm:p-6">
                <div class="flex">
                  <div class="mr-4 shrink-0">
                    <img
                      class="inline-block size-14 rounded-md"
                      :src="selectedGame?.image"
                      alt=""
                    />
                  </div>
                  <div>
                    <h6 class="text-lg font-bold">{{ selectedGame?.name }}</h6>
                    <p class="mt-1">
                      {{ selectedGame.year }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label for="email" class="block text-sm/6 font-medium text-gray-900">Owner</label>
            <div class="mt-2">
              <input
                id="owner"
                name="owner"
                type="text"
                v-model="owner"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <Listbox as="div" v-model="selectedLocation">
              <ListboxLabel class="block text-sm/6 font-medium text-gray-900"
                >Location</ListboxLabel
              >
              <div class="relative mt-2">
                <ListboxButton
                  class="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <span class="col-start-1 row-start-1 truncate pr-6">{{
                    selectedLocation?.name
                  }}</span>
                  <ChevronUpDownIcon
                    class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    aria-hidden="true"
                  />
                </ListboxButton>

                <transition
                  leave-active-class="transition ease-in duration-100"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <ListboxOptions
                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm"
                  >
                    <ListboxOption
                      as="template"
                      v-for="location in locations"
                      :key="location.id"
                      :value="location"
                      v-slot="{ active, selected }"
                    >
                      <li
                        :class="[
                          active ? 'bg-indigo-600 text-white outline-hidden' : 'text-gray-900',
                          'relative cursor-default py-2 pr-9 pl-3 select-none',
                        ]"
                      >
                        <span
                          :class="[
                            selectedLocation ? 'font-semibold' : 'font-normal',
                            'block truncate',
                          ]"
                          >{{ location.name }}</span
                        >

                        <span
                          v-if="selected"
                          :class="[
                            active ? 'text-white' : 'text-indigo-600',
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                          ]"
                        >
                          <CheckIcon class="size-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>

          <div class="sm:col-span-4">
            <label for="comment" class="block text-sm/6 font-medium text-gray-900"
              >Add your comment</label
            >
            <div class="mt-2">
              <textarea
                rows="4"
                name="comment"
                id="comment"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
  <SearchDialog :open="dialogOpen" @selected-game="onSelectedGame"></SearchDialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import SearchDialog from '@/components/SearchDialog.vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpDownIcon } from '@heroicons/vue/16/solid'
import { CheckIcon } from '@heroicons/vue/20/solid'
import LocationGetService from '@/features/locations/get/service.ts'
import type { ExternalGame } from '@/features/external-game/model.ts'
import LibraryService from '@/features/library/service.ts'
import type { GameLocation } from '@/features/locations/model.ts'
import router from '@/router'

const notes = ref('')
const owner = ref('')
const dialogOpen = ref(false)
const selectedGame = ref<ExternalGame>({} as unknown as ExternalGame)
const selectedLocation = ref<GameLocation>({} as unknown as GameLocation)
const locations = ref<{ id: number; name: string }[]>([])

const onSelectedGame = async (game: ExternalGame) => {
  console.log(game)
  dialogOpen.value = false
  selectedGame.value = game
}

const submit = async () => {
  await LibraryService.post(
    selectedGame.value.id,
    selectedLocation.value.id,
    owner.value,
    notes.value,
  )
  await router.push({ name: 'LibraryHome' })
}

onMounted(async () => {
  locations.value.push(...((await LocationGetService.get()) as { id: number; name: string }[]))
})
</script>
