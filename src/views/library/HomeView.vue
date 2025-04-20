<template>
  <main class="min-h-full">
    <HomeTemplate title="Library">
      <template v-slot:action>
        <RouterLink to="/library/new">
          <button
            type="button"
            class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add
          </button>
        </RouterLink>
      </template>
      <template v-slot:default>
        <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="game in games"
            :key="game.id"
            class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow-sm"
          >
            <div class="flex w-full items-center justify-between space-x-6 p-6">
              <div class="flex-1 truncate">
                <div class="flex items-center space-x-3">
                  <h3 class="truncate text-sm font-medium text-gray-900">{{ game.game.name }}</h3>
                  <span
                    class="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
                    >Available</span
                  >
                </div>
                <p class="mt-1 truncate text-sm text-gray-500">{{ game.game.year }}</p>
              </div>
              <img class="size-20 shrink-0 rounded-md bg-gray-300" :src="game.game.image" alt="" />
            </div>
          </li>
        </ul>
      </template>
    </HomeTemplate>
  </main>
</template>

<script lang="ts">
import { onMounted, reactive } from 'vue'
import Service from '@/features/library/service.ts'
import HomeTemplate from '@/views/_templates/HomeTemplate.vue'
import type { Game } from '@/features/library/game.model.ts'

export default {
  components: { HomeTemplate },
  setup() {
    const games = reactive<Game[]>([])

    onMounted(async () => {
      const result = await Service.get()

      games.push(...result)
    })

    // expose to template and other options API hooks
    return {
      games,
    }
  },
}
</script>
