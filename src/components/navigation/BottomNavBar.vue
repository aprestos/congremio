<script setup lang="ts">
import { useRoute } from 'vue-router'

interface NavigationItem {
  label: string
  routeName: string
  icon: unknown
  enabled: boolean
}

defineProps<{
  navigation: NavigationItem[]
}>()

const route = useRoute()
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-900 bg-opacity-25 sticky bottom-0 flex items-center justify-center border-0 border-t-1 backdrop-blur-sm border-t-indigo-100 lg:hidden"
  >
    <div class="w-full">
      <div class="opacity-90 shadow-lg">
        <div class="flex">
          <div
            v-for="item in navigation"
            :key="item.label"
            :class="[
              item.routeName === route.name
                ? 'bg-gray-100 text-indigo-600 dark:bg-white/5 dark:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white',
              'group flex gap-x-3 p-1 text-sm/6 font-semibold flex-1',
            ]"
          >
            <RouterLink
              v-if="item.enabled"
              :to="{ name: item.routeName }"
              class="flex items-end justify-center text-center mx-auto px-4 pt-1 w-full"
            >
              <span class="block px-1 pt-1 pb-1 text-center">
                <component
                  :is="item.icon"
                  class="pt-1 mb-1 block size-7 mx-auto"
                  aria-hidden="true"
                />
                <span class="block text-xs font-semibold pb-2">{{
                  item.label
                }}</span>
                <span
                  class="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"
                />
              </span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
