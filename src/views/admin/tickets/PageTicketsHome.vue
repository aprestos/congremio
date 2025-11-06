<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { IconPlus, IconTicket } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { editionStore } from '@/stores/edition'
import DataTable from '@/components/DataTable.vue'
import type { DataTableColumn } from '@/components/DataTable.vue'
import CBadge from '@/components/CBadge.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import ticketService from '@/features/tickets/service'
import {
  type Ticket,
  TicketStatus,
  getTicketStatusLabel,
  getTicketTypeLabel,
  calculateAvailability,
} from '@/features/tickets/ticket.model'

const { t } = useI18n()

// State
const tickets = ref<Ticket[]>([])
const loading = ref(false)
const selectedTicket = ref<Ticket | null>(null)
const statistics = ref({
  totalTickets: 0,
  totalSold: 0,
  totalRevenue: 0,
  activeTickets: 0,
})

let unsubscribe: (() => void) | null = null

// Table columns
const tableColumns = computed((): DataTableColumn<Ticket>[] => [
  {
    key: 'name',
    label: t('admin.tickets.name', 'Name'),
    sortable: true,
    sortFn: (a: Ticket, b: Ticket): number => {
      return a.name.localeCompare(b.name)
    },
  },
  {
    key: 'type',
    label: t('admin.tickets.type', 'Type'),
    sortable: true,
  },
  {
    key: 'price',
    label: t('admin.tickets.price', 'Price'),
    sortable: true,
    sortFn: (a: Ticket, b: Ticket): number => {
      return a.price - b.price
    },
  },
  {
    key: 'availability',
    label: t('admin.tickets.availability', 'Availability'),
    sortable: true,
    sortFn: (a: Ticket, b: Ticket): number => {
      return calculateAvailability(a) - calculateAvailability(b)
    },
  },
  {
    key: 'status',
    label: t('admin.tickets.status', 'Status'),
    sortable: true,
  },
])

// Computed
const formattedTickets = computed(() => {
  return tickets.value.map((ticket) => ({
    ...ticket,
    formattedPrice: `${ticket.price.toFixed(2)} ${ticket.currency}`,
    availabilityPercent: calculateAvailability(ticket),
  }))
})

// Methods
async function loadTickets(): Promise<void> {
  if (!editionStore.value?.id) {
    console.warn('No edition selected')
    return
  }

  loading.value = true
  try {
    tickets.value = await ticketService.getByEdition(editionStore.value.id)
    await loadStatistics()
  } catch (error) {
    console.error('Error loading tickets:', error)
    toast.error(t('admin.tickets.error.load', 'Failed to load tickets'))
  } finally {
    loading.value = false
  }
}

async function loadStatistics(): Promise<void> {
  if (!editionStore.value?.id) return

  try {
    statistics.value = await ticketService.getStatistics(editionStore.value.id)
  } catch (error) {
    console.error('Error loading statistics:', error)
  }
}

function openCreateDialog(): void {
  // TODO: Implement create dialog
  toast.info(
    t('admin.tickets.info.createDialog', 'Create ticket dialog - Coming soon'),
  )
}

function handleEdit(ticket: Ticket): void {
  selectedTicket.value = ticket
  // TODO: Implement edit dialog
  toast.info(
    t('admin.tickets.info.editDialog', 'Edit ticket dialog - Coming soon'),
  )
}

function handleDelete(ticket: Ticket): void {
  selectedTicket.value = ticket
  // TODO: Implement delete confirmation dialog
  toast.info(
    t('admin.tickets.info.deleteDialog', 'Delete ticket dialog - Coming soon'),
  )
}

async function handleStatusToggle(ticket: Ticket): Promise<void> {
  try {
    const newStatus =
      ticket.status === TicketStatus.ACTIVE
        ? TicketStatus.INACTIVE
        : TicketStatus.ACTIVE

    await ticketService.updateStatus(ticket.id, newStatus)
    toast.success(
      t('admin.tickets.success.statusUpdated', 'Ticket status updated'),
    )
    await loadTickets()
  } catch (error) {
    console.error('Error updating ticket status:', error)
    toast.error(
      t('admin.tickets.error.statusUpdate', 'Failed to update ticket status'),
    )
  }
}

function getStatusBadgeVariant(
  status: TicketStatus,
): 'success' | 'warning' | 'error' {
  switch (status) {
    case TicketStatus.ACTIVE:
      return 'success'
    case TicketStatus.SOLD_OUT:
      return 'error'
    default:
      return 'warning'
  }
}

// Lifecycle
onMounted(async () => {
  await loadTickets()

  // Subscribe to real-time updates
  if (editionStore.value?.id) {
    unsubscribe = ticketService.subscribe(editionStore.value.id, () => {
      void loadTickets()
    })
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 mb-4">
      <!-- Loading skeletons -->
      <template v-if="loading">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 ring-1 ring-gray-200 dark:ring-gray-700"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <SkeletonLoader class="h-4 w-24 mb-3" />
              <SkeletonLoader class="h-8 w-16" />
            </div>
            <SkeletonLoader class="size-8 rounded-full" />
          </div>
        </div>
      </template>

      <!-- Actual statistics -->
      <template v-else>
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 ring-1 ring-gray-200 dark:ring-gray-700"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ t('admin.tickets.stats.total', 'Total Tickets') }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ statistics.totalTickets }}
              </p>
            </div>
            <IconTicket class="size-8 text-primary-500" />
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 ring-1 ring-gray-200 dark:ring-gray-700"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ t('admin.tickets.stats.sold', 'Sold') }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ statistics.totalSold }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 ring-1 ring-gray-200 dark:ring-gray-700"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ t('admin.tickets.stats.revenue', 'Revenue') }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ statistics.totalRevenue.toFixed(2) }} €
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 ring-1 ring-gray-200 dark:ring-gray-700"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ t('admin.tickets.stats.active', 'Active Tickets') }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ statistics.activeTickets }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Tickets Table -->
    <DataTable
      :items="formattedTickets"
      :columns="tableColumns"
      :items-per-page="25"
      :loading="loading"
    >
      <!-- Custom cell for name -->
      <template #cell-name="{ item }">
        <div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ item.name }}
          </div>
          <div
            v-if="item.description"
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            {{ item.description }}
          </div>
        </div>
      </template>

      <!-- Custom cell for type -->
      <template #cell-type="{ item }">
        <span class="text-gray-900 dark:text-gray-200">
          {{ getTicketTypeLabel(item.type) }}
        </span>
      </template>

      <!-- Custom cell for price -->
      <template #cell-price="{ item }">
        <span class="font-medium text-gray-900 dark:text-white">
          {{ item.formattedPrice }}
        </span>
      </template>

      <!-- Custom cell for availability -->
      <template #cell-availability="{ item }">
        <div class="space-y-1">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">
              {{ item.quantity_available }} / {{ item.quantity_total }}
            </span>
            <span class="text-gray-600 dark:text-gray-400">
              {{ item.availabilityPercent }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all"
              :class="{
                'bg-green-500': item.availabilityPercent > 50,
                'bg-yellow-500':
                  item.availabilityPercent > 20 &&
                  item.availabilityPercent <= 50,
                'bg-red-500': item.availabilityPercent <= 20,
              }"
              :style="{ width: `${item.availabilityPercent}%` }"
            />
          </div>
        </div>
      </template>

      <!-- Custom cell for status -->
      <template #cell-status="{ item }">
        <CBadge :variant="getStatusBadgeVariant(item.status)">
          {{ getTicketStatusLabel(item.status) }}
        </CBadge>
      </template>

      <!-- Actions slot -->
      <template #actions="{ item }">
        <div class="flex items-center gap-2">
          <button
            class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            @click="handleEdit(item)"
          >
            {{ t('admin.tickets.actions.edit', 'Edit') }}
          </button>
          <button
            class="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            @click="handleStatusToggle(item)"
          >
            {{
              item.status === TicketStatus.ACTIVE
                ? t('admin.tickets.actions.deactivate', 'Deactivate')
                : t('admin.tickets.actions.activate', 'Activate')
            }}
          </button>
          <button
            class="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            @click="handleDelete(item)"
          >
            {{ t('admin.tickets.actions.delete', 'Delete') }}
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Floating Add Button -->
    <div
      class="group fixed bottom-0 right-0 flex items-end justify-end w-24 h-24 p-1"
    >
      <button
        class="z-50 rounded-full text-gray-900 dark:text-gray-200 text-nowrap absolute mr-4 mb-4 py-4 px-4 font-semibold dark:bg-gray-800/90 backdrop-blur-2xl bg-gray-50/90 ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden shadow-2xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        @click="openCreateDialog"
      >
        <IconPlus stroke="2.5" class="size-6 inline-block" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
