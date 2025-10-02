<template>
  <div class="flex flex-col h-full">
    <!-- Header slot for search and other controls -->
    <div
      v-if="$slots.header"
      class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white dark:bg-gray-900 dark:border-white/5 border-b border-gray-200 px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8"
    >
      <slot name="header" />
    </div>

    <!-- Table container -->
    <div class="flex-1 overflow-hidden px-4 sm:gap-x-6 sm:px-0 min-h-0">
      <div class="h-full overflow-auto">
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
      </div>
    </div>

    <!-- Pagination controls -->
    <div
      class="flex items-center justify-center border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 pb-3 sm:px-6"
    >
      <div class="flex flex-1 justify-between sm:hidden">
        <!-- Mobile pagination -->
        <button
          :disabled="currentPage === 1"
          class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </button>
        <button
          :disabled="currentPage === totalPages"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-col sm:items-center sm:gap-2">
        <div>
          <nav
            class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 dark:border-white/10"
          >
            <div class="hidden md:-mt-px md:flex">
              <template v-for="page in visiblePages" :key="page">
                <button
                  v-if="page !== '...'"
                  :class="[
                    'inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium',
                    page === currentPage
                      ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-200',
                  ]"
                  :aria-current="page === currentPage ? 'page' : undefined"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <span
                  v-else
                  class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  ...
                </span>
              </template>
            </div>
          </nav>
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

const currentPage = ref(1)

// Computed properties for pagination
const totalItems = computed(() => props.items.length)

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / props.itemsPerPage)
})

const displayedItems = computed((): T[] => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return props.items.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: (number | string)[] = []

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show smart pagination with ellipsis
    if (current <= 4) {
      // Show 1, 2, 3, 4, 5, ..., last
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      if (total > 6) {
        pages.push('...')
        pages.push(total)
      }
    } else if (current >= total - 3) {
      // Show 1, ..., last-4, last-3, last-2, last-1, last
      pages.push(1)
      if (total > 6) {
        pages.push('...')
      }
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Show 1, ..., current-1, current, current+1, ..., last
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
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

// Pagination functions
const goToPage = (page: number | string): void => {
  if (typeof page === 'string') return
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// Reset pagination when items change (e.g., after search)
const resetPagination = (): void => {
  currentPage.value = 1
}

// Watch for items changes to reset pagination
watch(
  () => props.items.length,
  () => {
    currentPage.value = 1
  },
)

// Expose methods for parent component
defineExpose({
  resetPagination,
})
</script>
