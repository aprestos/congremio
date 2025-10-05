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
                  column.sortable !== false
                    ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none'
                    : '',
                  // Add light background when sorting is active
                  sortConfig.key === column.key
                    ? 'bg-indigo-50 dark:bg-gray-800/50'
                    : '',
                ]"
                @click="
                  column.sortable !== false ? handleSort(column.key) : null
                "
              >
                <div class="flex items-center justify-between w-full">
                  <span>{{ column.label }}</span>
                  <div
                    v-if="column.sortable !== false"
                    class="flex flex-col ml-1"
                  >
                    <IconSortAscending
                      v-if="
                        sortConfig.key === column.key &&
                        sortConfig.direction === 'asc'
                      "
                      class="h-3 w-3 text-gray-700 dark:text-gray-300"
                    />
                    <IconSortDescending
                      v-else-if="
                        sortConfig.key === column.key &&
                        sortConfig.direction === 'desc'
                      "
                      class="h-3 w-3 text-gray-700 dark:text-gray-300"
                    />
                    <IconArrowsSort
                      v-else
                      class="h-3 w-3 text-gray-400 dark:text-gray-500"
                    />
                  </div>
                </div>
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

<script setup lang="ts" generic="T">
import { ref, computed, type PropType, watch } from 'vue'
import {
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-vue'

export interface DataTableColumn<T = Record<string, unknown>> {
  key: string
  label: string
  hidden?: boolean
  align?: 'left' | 'right' | 'center'
  headerClass?: string
  cellClass?: string
  skeletonClass?: string
  sortable?: boolean
  sortFn?: (a: T, b: T) => number
}

interface SortConfig {
  key: string | null
  direction: 'asc' | 'desc' | null
}

const props = defineProps({
  items: {
    type: Array as PropType<T[]>,
    required: true,
  },
  columns: {
    type: Array as PropType<DataTableColumn<T>[]>,
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
const sortConfig = ref<SortConfig>({ key: null, direction: null })

// Computed properties for sorting and infinite scroll
const sortedItems = computed((): T[] => {
  if (!sortConfig.value.key || !sortConfig.value.direction) {
    return [...props.items]
  }

  const column = props.columns.find((col) => col.key === sortConfig.value.key)
  const sortedArray = [...props.items]

  if (column?.sortFn) {
    // Use custom sort function
    sortedArray.sort(column.sortFn)
  } else {
    // Default sort function
    sortedArray.sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.value.key!) as any
      const bValue = getNestedValue(b, sortConfig.value.key!) as any

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1

      // Handle different types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue
      }

      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        return aValue.getTime() - bValue.getTime()
      }

      // Fallback to string comparison
      return String(aValue).localeCompare(String(bValue))
    })
  }

  // Reverse if descending
  if (sortConfig.value.direction === 'desc') {
    sortedArray.reverse()
  }

  return sortedArray
})

const totalItems = computed(() => sortedItems.value.length)

const displayedItems = computed((): T[] => {
  return sortedItems.value.slice(0, currentLoadedCount.value)
})

const hasMoreItems = computed(() => {
  return currentLoadedCount.value < totalItems.value
})

// Helper functions
const getRowKey = (item: T, index: number): string | number => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item, index)
  }
  return (
    ((item as { [props.rowKey]: string })[props.rowKey] as string | number) ||
    index
  )
}

const getNestedValue = (obj: T, path: string): unknown => {
  return path.split('.').reduce((current: unknown, key: string) => {
    return current && typeof current === 'object' && key in current
      ? (current as Record<string, unknown>)[key]
      : undefined
  }, obj)
}

// Sort functions
const handleSort = (columnKey: string): void => {
  if (sortConfig.value.key === columnKey) {
    // Same column: cycle through asc -> desc -> none
    if (sortConfig.value.direction === 'asc') {
      sortConfig.value.direction = 'desc'
    } else if (sortConfig.value.direction === 'desc') {
      sortConfig.value.key = null
      sortConfig.value.direction = null
    }
  } else {
    // New column: start with ascending
    sortConfig.value.key = columnKey
    sortConfig.value.direction = 'asc'
  }

  // Reset infinite scroll when sorting changes
  resetInfiniteScroll()
}

// Infinite scroll functions
const loadMoreItems = async (): Promise<void> => {
  if (isLoading.value || !hasMoreItems.value) return

  isLoading.value = true

  // Simulate slight delay for smooth UX (optional)
  await new Promise((resolve) => setTimeout(resolve, 100))

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
    void loadMoreItems()
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
  clearSort: () => {
    sortConfig.value.key = null
    sortConfig.value.direction = null
    resetInfiniteScroll()
  },
  getSortConfig: () => sortConfig.value,
})
</script>
