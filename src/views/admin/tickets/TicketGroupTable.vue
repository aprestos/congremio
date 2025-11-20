<script setup lang="ts">
import { computed } from 'vue'
import { IconEdit, IconTrash, IconEye, IconTicket } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import CBadge from '@/components/CBadge.vue'
import DataTable from '@/components/DataTable.vue'
import type { DataTableColumn } from '@/components/DataTable.vue'
import type { Ticket } from '@/features/tickets/ticket.model'

interface Props {
  tickets: Ticket[]
  formatPrice: (price: number) => string
  formatDateRange: (from?: string, until?: string) => string
}

interface Emits {
  (e: 'view', ticket: Ticket): void
  (e: 'edit', ticket: Ticket): void
  (e: 'delete', ticket: Ticket): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

// Table columns definition
const tableColumns = computed<DataTableColumn<Ticket>[]>(() => [
  { key: 'name', label: t('admin.tickets.name'), sortable: true },
  { key: 'price', label: t('admin.tickets.price'), sortable: true },
  { key: 'quantity', label: t('admin.tickets.quantity'), sortable: true },
  { key: 'status', label: t('admin.tickets.status'), sortable: true },
  {
    key: 'sale_period',
    label: t('admin.tickets.salePeriod'),
    sortable: false,
    breakpoint: 'lg',
  },
  {
    key: 'valid_period',
    label: t('admin.tickets.validPeriod'),
    sortable: false,
    breakpoint: 'lg',
  },
])

const getStatusBadgeVariant = (
  ticket: Ticket,
): 'success' | 'warning' | 'danger' => {
  return ticket.active ? 'success' : 'danger'
}

const handleView = (ticket: Ticket): void => {
  emit('view', ticket)
}

const handleEdit = (ticket: Ticket): void => {
  emit('edit', ticket)
}

const handleDelete = (ticket: Ticket): void => {
  emit('delete', ticket)
}
</script>

<template>
  <!-- Empty State -->
  <div
    v-if="tickets.length === 0"
    class="flex flex-col items-center justify-center py-12 px-6 text-center"
  >
    <IconTicket
      class="h-12 w-12 text-gray-400 dark:text-gray-500"
      stroke="1.5"
    />
    <h3 class="mt-4 text-sm font-medium text-gray-900 dark:text-white">
      {{ t('admin.tickets.noTicketsInGroup') }}
    </h3>
    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {{ t('admin.tickets.clickAddToCreate') }}
    </p>
  </div>

  <!-- DataTable -->
  <DataTable
    v-else
    :items="tickets"
    :columns="tableColumns"
    :items-per-page="10"
  >
    <!-- Custom cell for name -->
    <template #cell-name="{ item }">
      <div class="text-sm font-medium text-gray-900 dark:text-white">
        {{ item.name }}
      </div>
    </template>

    <!-- Custom cell for price -->
    <template #cell-price="{ item }">
      <div class="text-sm font-semibold text-gray-900 dark:text-white">
        {{ formatPrice(item.price) }}
      </div>
    </template>

    <!-- Custom cell for quantity -->
    <template #cell-quantity="{ item }">
      <div class="text-sm text-gray-900 dark:text-white">
        {{ item.quantity || 0 }}
      </div>
    </template>

    <!-- Custom cell for status -->
    <template #cell-status="{ item }">
      <CBadge :variant="getStatusBadgeVariant(item)">
        {{
          item.active ? t('admin.tickets.active') : t('admin.tickets.inactive')
        }}
      </CBadge>
    </template>

    <!-- Custom cell for sale period -->
    <template #cell-sale_period="{ item }">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ formatDateRange(item.sale_from, item.sale_until) }}
      </div>
    </template>

    <!-- Custom cell for valid period -->
    <template #cell-valid_period="{ item }">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ formatDateRange(item.valid_from, item.valid_until) }}
      </div>
    </template>

    <!-- Actions slot -->
    <template #actions="{ item }">
      <div class="flex items-center justify-end gap-2">
        <button
          class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="View"
          aria-label="View"
          @click="handleView(item)"
        >
          <IconEye class="size-4" />
        </button>
        <button
          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          title="Edit"
          aria-label="Edit"
          @click="handleEdit(item)"
        >
          <IconEdit class="size-4" />
        </button>
        <button
          class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          title="Delete"
          aria-label="Delete"
          @click="handleDelete(item)"
        >
          <IconTrash class="size-4" />
        </button>
      </div>
    </template>
  </DataTable>
</template>
