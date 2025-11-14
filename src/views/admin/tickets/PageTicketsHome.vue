<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import {
  IconPlus,
  IconTicket,
  IconEdit,
  IconTrash,
  IconEye,
  IconCurrencyEuro,
  IconUsers,
  IconCalendar,
} from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { editionStore } from '@/stores/edition'
import ticketService from '@/features/tickets/service'
import {
  type Ticket,
  TicketGroup,
  TicketStatus,
} from '@/features/tickets/ticket.model'
import { tenantStore } from '@/stores/tenant.ts'
import logger from '@/lib/logger.ts'
import CBadge from '@/components/CBadge.vue'
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import StatisticCard from '@/components/StatisticCard.vue'
import type { DataTableColumn } from '@/components/DataTable.vue'

const { t } = useI18n()

// State
const tickets = ref<Ticket[]>([])
const loading = ref(false)
const selectedTicket = ref<Ticket | null>(null)
const shownDialog = ref<string>('')

// Table columns definition
const tableColumns: DataTableColumn<Ticket>[] = [
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
]

// Computed - Statistics
const statistics = computed(() => {
  const total = tickets.value.length
  const active = tickets.value.filter(
    (t) => t.status === TicketStatus.ACTIVE,
  ).length
  const totalRevenue = tickets.value.reduce(
    (sum, t) => sum + t.price * (t.quantity || 0),
    0,
  )
  const totalQuantity = tickets.value.reduce(
    (sum, t) => sum + (t.quantity || 0),
    0,
  )

  return {
    total,
    active,
    inactive: tickets.value.filter((t) => t.status === TicketStatus.INACTIVE)
      .length,
    soldOut: tickets.value.filter((t) => t.status === TicketStatus.SOLD_OUT)
      .length,
    totalRevenue,
    totalQuantity,
  }
})

// Computed - Group tickets by TicketGroup
const ticketsByGroup = computed(() => {
  const grouped: Record<TicketGroup, Ticket[]> = {
    [TicketGroup.GENERAL]: [],
    [TicketGroup.ADMIN]: [],
  }

  tickets.value.forEach((ticket) => {
    if (ticket.group in grouped) {
      grouped[ticket.group].push(ticket)
    } else {
      logger.warn(
        `[ticketsByGroup] Unexpected ticket group: "${ticket.group}" for ticket:`,
        ticket,
      )
    }
  })

  return grouped
})

// Helper functions
const getGroupName = (group: TicketGroup): string => {
  const names: Record<TicketGroup, string> = {
    [TicketGroup.GENERAL]: t('admin.tickets.general'),
    [TicketGroup.ADMIN]: t('admin.tickets.vip'),
  }
  return names[group]
}

const getStatusBadgeVariant = (
  status: TicketStatus,
): 'success' | 'warning' | 'danger' => {
  const variants: Record<TicketStatus, 'success' | 'warning' | 'danger'> = {
    [TicketStatus.ACTIVE]: 'success',
    [TicketStatus.INACTIVE]: 'warning',
    [TicketStatus.SOLD_OUT]: 'danger',
  }
  return variants[status]
}

const formatPrice = (price: number): string => {
  const locale = useI18n().locale.value
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: editionStore.value?.currency,
  }).format(price)
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-'
  const locale = useI18n().locale.value
  return new Date(dateStr).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatDateRange = (from?: string, until?: string): string => {
  if (!from && !until) return '-'
  const locale = useI18n().locale.value
  if (from && until) {
    const fromDate = new Date(from).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
    })
    const untilDate = new Date(until).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    return `${fromDate} - ${untilDate}`
  }
  if (from) return `From ${formatDate(from)}`
  return `Until ${formatDate(until)}`
}

// Actions
const handleEdit = (ticket: Ticket): void => {
  selectedTicket.value = ticket
  shownDialog.value = 'edit'
  toast.info(t('admin.tickets.editFunctionalityComingSoon'))
}

const handleDelete = async (ticket: Ticket): Promise<void> => {
  try {
    await ticketService.delete(ticket.id)
    toast.success(t('admin.tickets.deleteSuccess'))
    await loadTickets()
  } catch (error) {
    logger.error('Error deleting ticket:', {
      error,
      ticketId: ticket.id,
      ticketName: ticket.name,
    })
    toast.error(t('admin.tickets.deleteFailed'))
  }
}

const handleView = (ticket: Ticket): void => {
  selectedTicket.value = ticket
  shownDialog.value = 'view'
  toast.info(t('admin.tickets.viewDetailsFunctionalityComingSoon'))
}

const handleAdd = (): void => {
  shownDialog.value = 'add'
  toast.info(t('admin.tickets.addTicketFunctionalityComingSoon'))
}

// Methods
async function loadTickets(): Promise<void> {
  if (!tenantStore.value?.id || !editionStore.value?.id) {
    logger.warn('No edition selected')
    return
  }

  loading.value = true
  try {
    tickets.value = await ticketService.get(
      tenantStore.value.id,
      editionStore.value.id,
    )
  } catch (error) {
    logger.error('Error loading tickets:', {
      error,
      editionId: editionStore.value.id,
      tenantId: tenantStore.value.id,
    })
    toast.error(t('admin.tickets.loadFailed'))
  } finally {
    loading.value = false
  }
}

const groups = computed(() => {
  return Object.values(TicketGroup)
})

// Lifecycle
onMounted(async () => {
  await loadTickets()
})
</script>

<template>
  <div class="flex flex-col space-y-6 p-0 sm:p-6">
    <!-- Page Header -->
    <PageHeader
      :title="t('admin.tickets.title')"
      :description="t('admin.tickets.description')"
      :action-label="t('admin.tickets.addTicket')"
      class="p-6 sm:p-0"
      @action="handleAdd"
    >
      <template #action-icon>
        <IconPlus class="size-5" stroke="2" />
      </template>
    </PageHeader>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 sm:gap-6">
      <StatisticCard
        :label="t('admin.tickets.totalTickets')"
        :value="statistics.total"
        :icon="IconTicket"
        icon-color="text-blue-600 dark:text-blue-400"
        :subtitle="`${t('admin.tickets.active')}: ${statistics.active} • ${t('admin.tickets.inactive')}: ${statistics.inactive}`"
      />

      <StatisticCard
        :label="t('admin.tickets.revenuePotential')"
        :value="formatPrice(statistics.totalRevenue)"
        :icon="IconCurrencyEuro"
        icon-color="text-green-600 dark:text-green-400"
        :subtitle="t('admin.tickets.basedOnQuantityPrice')"
      />

      <StatisticCard
        :label="t('admin.tickets.totalCapacity')"
        :value="statistics.totalQuantity"
        :icon="IconUsers"
        icon-color="text-purple-600 dark:text-purple-400"
        :subtitle="t('admin.tickets.totalAvailableSlots')"
      />

      <StatisticCard
        :label="t('admin.tickets.activeStatus')"
        :value="statistics.active"
        :icon="IconCalendar"
        icon-color="text-emerald-600 dark:text-emerald-400"
        :subtitle="t('admin.tickets.currentlyOnSale')"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        role="status"
        aria-label="Loading tickets"
      >
        <span class="sr-only">{{ t('common.loading') }}</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="tickets.length === 0"
      class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700"
    >
      <IconTicket class="mx-auto h-16 w-16 text-gray-400" stroke="1.5" />
      <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('admin.tickets.noTicketsYet') }}
      </h3>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {{ t('admin.tickets.getStartedCreating') }}
      </p>
      <button
        class="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
        @click="handleAdd"
      >
        <IconPlus class="size-4" />
        {{ t('admin.tickets.createFirstTicket') }}
      </button>
    </div>

    <!-- Tickets Table by Group -->
    <div v-else class="space-y-6">
      <div
        v-for="group in groups"
        v-show="ticketsByGroup[group].length > 0"
        :key="group"
        class="bg-white dark:bg-gray-800 sm:rounded-xl shadow-sm sm:border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Group Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ getGroupName(group) }}
            <span
              class="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400"
            >
              ({{ ticketsByGroup[group].length }})
            </span>
          </h2>
        </div>

        <!-- DataTable -->
        <DataTable
          :items="ticketsByGroup[group]"
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
            <CBadge :variant="getStatusBadgeVariant(item.status)">
              {{ item.status }}
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
      </div>
    </div>
  </div>
</template>

<style scoped></style>
