<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Library Games</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all the games present in your library.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add user
        </button>
      </div>
    </div>
    <div class="-mx-4 mt-8 sm:-mx-0">
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 table-cell"
            >
              Status
            </th>
            <th
              scope="col"
              class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
            >
              Players
            </th>
            <th scope="col" class="relative py-3.5 pr-4 pl-3 sm:pr-0">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="game in games" :key="game.id">
            <td class="py-5 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-0">
              <div class="flex items-center">
                <div class="size-11 shrink-0">
                  <img class="size-11 rounded-sm" :src="game.game.image" alt="" />
                </div>
                <div class="ml-4">
                  <div class="font-medium text-gray-900">{{ game.game.name }}</div>
                  <div class="mt-1 text-gray-500">{{ game.game.year }}</div>
                </div>
              </div>
            </td>
            <td class="px-3 py-4 text-sm text-gray-500">
              <div class="flex items-center">
                <div
                  class="text-green-700 bg-green-50 ring-green-600/20 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                >
                  Available
                </div>
              </div>
            </td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
              {{ game.game.min_players }} - {{ game.game.max_players }}
            </td>
            <td class="py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-0">
              <a href="#" class="text-indigo-600 hover:text-indigo-900"
                >Edit<span class="sr-only">, {{ game.game.name }}</span></a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import type { Game } from '@/features/library/game.model.ts'
import Service from '@/features/library/service.ts'

const games = reactive<Game[]>([])

onMounted(async () => {
  const result = await Service.get()

  games.push(...result)
})
</script>
