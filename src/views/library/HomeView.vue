<template>
  <main class="min-h-full">
    <HomeTemplate title="Library">
      <template #default>
        <!--        <div class="mx-auto max-w-2xl lg:max-w-7xl">-->
        <!--          <h2 class="sr-only">Products</h2>-->

        <!--          <div-->
        <!--            class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"-->
        <!--          >-->
        <!--            <a v-for="game in games" :key="game.id" href="#" class="group">-->
        <!--              <img-->
        <!--                :src="game.game.image"-->
        <!--                :alt="game.game.name + ' cover image'"-->
        <!--                class="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"-->
        <!--              />-->
        <!--              <h3 class="mt-4 text-sm text-gray-700">-->
        <!--                {{ game.game.year || "unknown published year" }}-->
        <!--              </h3>-->
        <!--              <p class="mt-1 text-lg font-medium text-gray-900">-->
        <!--                {{ game.game.name }}-->
        <!--              </p>-->
        <!--            </a>-->
        <!--          </div>-->
        <!--        </div>-->
        <GamesView :games="games" />
      </template>
    </HomeTemplate>
  </main>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { LibraryGame } from '@/features/library/game.model.ts'
import Service from '@/features/library/service.ts'
import { eventStore } from '@/stores/event'
import HomeTemplate from '@/views/_templates/HomeTemplate.vue'
import GamesView from '@/views/library/GamesView.vue'

const games = reactive<LibraryGame[]>([])

watch(
  () => eventStore.value,
  async (event) => {
    if (event) {
      const result = await Service.get()
      games.push(...result)
    }
  },
  { immediate: true },
)
</script>
