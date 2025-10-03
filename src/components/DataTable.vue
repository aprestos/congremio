<template>
  <div class="flex flex-col min-h-0 h-full">
    <!-- Header slot for search and other controls -->
    <div
      v-if="$slots.header"
      class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white dark:bg-gray-900 dark:border-white/5 border-b border-gray-200 px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8"
    >
      <slot name="header" />
    </div>

    <!-- Table container -->
    <div class="flex-1 min-h-0 overflow-hidden">
      <div
        ref="scrollContainer"
        class="h-full overflow-auto"
        @scroll="handleScroll"
      >
        <table class="w-full divide-y divide-gray-200 dark:divide-white/15">
          <!-- Table header -->
          <thead>
            <tr>
              <th
                v-for="(column, index) in columns"
                :key="column.key"
                scope="col"
                :class="[
                  'py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase',
                  index === 0 ? 'pl-4 sm:pl-6 lg:pl-8 pr-3' : 'px-3 py-4',
                  column.hidden ? 'hidden lg:table-cell' : 'table-cell',
                  column.align === 'right' ? 'text-right' : 'text-left',
                  column.headerClass || '',
                ]"
              >
                {{ column.label }}
              </th>
              <!-- Actions column if actions slot is provided -->
              <th
                v-if="$slots.actions"
                scope="col"
                class="relative py-4 pr-4 sm:pr-6 lg:pr-8 pl-3"
              >
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <!-- Table body -->
          <tbody class="divide-y divide-gray-200 dark:divide-white/10">
            <!-- Data rows -->
            <tr
              v-for="(item, rowIndex) in displayedItems"
              :key="getRowKey(item, rowIndex)"
            >
              <td
                v-for="(column, colIndex) in columns"
                :key="column.key"
                :class="[
                  'py-4 text-sm',
                  colIndex === 0 ? 'pl-4 sm:pl-6 lg:pl-8 pr-3' : 'px-3',
                  column.hidden ? 'hidden lg:table-cell' : 'table-cell',
                  column.align === 'right' ? 'text-right' : 'text-left',
                  column.cellClass || 'text-gray-500 dark:text-gray-400',
                ]"
              >
                <slot
                  :name="`cell-${column.key}`"
                  :item="item"
                  :value="getNestedValue(item, column.key)"
                  :column="column"
                  :index="rowIndex"
                >
                  <!-- Default cell content -->
                  {{ getNestedValue(item, column.key) }}
                </slot>
              </td>
              <!-- Actions column -->
              <td
                v-if="$slots.actions"
                class="py-4 pr-4 sm:pr-6 lg:pr-8 pl-3 text-right text-sm font-medium"
              >
                <slot name="actions" :item="item" :index="rowIndex" />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Loading indicator -->
        <div
          v-if="isLoading && hasMoreItems"
          class="flex justify-center items-center py-8"
        >
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
          ></div>
        </div>

        <!-- End of results indicator -->
        <div
          v-if="!hasMoreItems && displayedItems.length > 0"
          class="flex justify-center items-center py-4 text-sm text-gray-500 dark:text-gray-400"
        >
          {{ displayedItems.length }} of {{ totalItems }} items loaded
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { ref, computed, type PropType, watch } from 'vue'

export interface DataTableColumn {
  key: string
  label: string
  hidden?: boolean
  align?: 'left' | 'right' | 'center'
  headerClass?: string
  cellClass?: string
  skeletonClass?: string
}

const props = defineProps({
  items: {
    type: Array as PropType<T[]>,
    required: true,
  },
  columns: {
    type: Array as PropType<DataTableColumn[]>,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    default: 20,
  },
  rowKey: {
    type: [String, Function] as PropType<
      string | ((item: T, index: number) => string | number)
    >,
    default: 'id',
  },
})

const scrollContainer = ref<HTMLElement>()
const currentLoadedCount = ref(props.itemsPerPage)
const isLoading = ref(false)

// Computed properties for infinite scroll
const totalItems = computed(() => props.items.length)

const displayedItems = computed((): T[] => {
  return props.items.slice(0, currentLoadedCount.value)
})

const hasMoreItems = computed(() => {
  return currentLoadedCount.value < totalItems.value
})

// Helper functions
const getRowKey = (item: T, index: number): string | number => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item, index)
  }
  return (item[props.rowKey] as string | number) || index
}

const getNestedValue = (obj: T, path: string): unknown => {
  return path.split('.').reduce((current: unknown, key: string) => {
    return current && typeof current === 'object' && key in current
      ? (current as Record<string, unknown>)[key]
      : undefined
  }, obj)
}

// Infinite scroll functions
const loadMoreItems = (): void => {
  if (isLoading.value || !hasMoreItems.value) return

  isLoading.value = true

  currentLoadedCount.value = Math.min(
    currentLoadedCount.value + props.itemsPerPage,
    totalItems.value,
  )

  isLoading.value = false
}

const handleScroll = (): void => {
  if (!scrollContainer.value || isLoading.value || !hasMoreItems.value) return

  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  const threshold = 100 // pixels from bottom to trigger load

  if (scrollTop + clientHeight >= scrollHeight - threshold) {
    loadMoreItems()
  }
}

// Reset when items change (e.g., after search)
const resetInfiniteScroll = (): void => {
  currentLoadedCount.value = props.itemsPerPage
  isLoading.value = false
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0
  }
}

// Watch for items changes to reset scroll
watch(
  () => props.items.length,
  () => {
    resetInfiniteScroll()
  },
)

// Also watch for items reference change (important for search)
watch(
  () => props.items,
  () => {
    resetInfiniteScroll()
  },
  { deep: false },
)

// Expose methods for parent component
defineExpose({
  resetInfiniteScroll,
})
</script>
