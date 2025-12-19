<script setup lang="ts">
import { computed } from 'vue'
import { IconTicket } from '@tabler/icons-vue'
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

defineProps<Props>()

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
    <template #actions>
      <div class="flex items-center justify-end gap-2">
        <!-- to be implemented later -->
      </div>
    </template>
  </DataTable>
</template>
