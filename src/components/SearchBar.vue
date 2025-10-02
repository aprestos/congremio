<template>
  <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
    <!-- Main search input -->
    <form class="grid flex-1 grid-cols-1">
      <input
        :value="searchValue"
        type="search"
        name="search"
        :aria-label="searchLabel"
        class="col-start-1 row-start-1 block size-full bg-white dark:bg-gray-800 pl-8 text-base text-gray-900 dark:text-white outline-hidden placeholder:text-gray-400 dark:placeholder:text-gray-500 sm:text-sm/6"
        :placeholder="searchPlaceholder"
        @input="
          $emit('update:searchValue', ($event.target as HTMLInputElement).value)
        "
      />
      <IconSearch
        class="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400 dark:text-gray-500"
        aria-hidden="true"
      />
    </form>

    <!-- Additional inputs slot -->
    <slot name="additional-inputs" />
  </div>
</template>

<script setup lang="ts">
import { IconSearch } from '@tabler/icons-vue'

defineProps<{
  searchValue: string
  searchPlaceholder?: string
  searchLabel?: string
}>()

defineEmits<{
  'update:searchValue': [value: string]
}>()
</script>
