<template>
  <div class="flex flex-col min-h-screen">
    <DataTable
      :items="filteredGames"
      :columns="tableColumns"
      :items-per-page="25"
    >
      <template #header>
        <div class="grid grid-cols-6 px-4 py-3 gap-4">
          <div class="col-span-5">
            <CInput
              id="search"
              v-model="searchInput"
              :placeholder="t('admin.library.search')"
              type="text"
              name="search"
            >
              <template #icon-left>
                <IconSearch
                  class="size-5 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
              </template>
            </CInput>
          </div>
          <div class="col-span-1">
            <CInput
              id="reservation"
              v-model="reservationInput"
              type="text"
              name="reservation"
              :placeholder="t('admin.library.reservation')"
            >
              <template #icon-left>
                <IconNumber
                  class="size-5 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
              </template>
            </CInput>
          </div>
        </div>
      </template>

      <!-- Custom cell for game name with image -->
      <template #cell-name="{ item }">
        <div class="flex items-center">
          <div class="size-11 shrink-0">
            <img
              class="size-11 rounded-sm object-cover bg-gray-200 dark:bg-gray-700"
              :src="item.game.image"
              alt=""
              @error="handleImageError"
              @load="handleImageLoad"
            />
          </div>
          <div class="ml-4">
            <div class="font-medium text-gray-900 dark:text-white">
              {{ (item as LibraryGame).game.name }}
            </div>
            <div class="mt-1 text-gray-500 dark:text-gray-400">
              {{ (item as LibraryGame).game.year }}
            </div>
          </div>
        </div>
      </template>

      <!-- Custom cell for status -->
      <template #cell-status="{ item }">
        <GameStatus :data="item" />
      </template>

      <!-- Custom cell for location -->
      <template #cell-location="{ item }">
        <span class="text-gray-500 dark:text-gray-200">{{
          getLocationName(item)
        }}</span>
      </template>

      <!-- Custom cell for players -->
      <template #cell-players="{ item }">
        <span class="text-gray-500 dark:text-gray-200">{{
          getRange(
            (item as LibraryGame).game.min_players,
            (item as LibraryGame).game.max_players,
          )
        }}</span>
      </template>

      <!-- Custom cell for playtime -->
      <template #cell-playtime="{ item }">
        <span class="text-gray-500 dark:text-gray-200">{{
          getRange(
            (item as LibraryGame).game.min_playtime,
            (item as LibraryGame).game.max_playtime,
          )
        }}</span>
      </template>

      <!-- Custom cell for age -->
      <template #cell-age="{ item }">
        <span class="text-gray-500 dark:text-gray-200">{{
          (item as LibraryGame).game.min_age
            ? (item as LibraryGame).game.min_age + '+'
            : '-'
        }}</span>
      </template>

      <!-- Custom cell for owner -->
      <template #cell-owner="{ item }">
        <span class="text-gray-500 dark:text-gray-200">{{
          (item as LibraryGame).owner
        }}</span>
      </template>

      <!-- Actions slot -->
      <template #actions="{ item }">
        <GameActions
          :data="item"
          @edit="(game) => openDialog(Dialog.edit, game)"
          @move="(game) => openDialog(Dialog.move, game)"
          @withdraw="(game) => openDialog(Dialog.withdraw, game)"
          @return="(game) => openDialog(Dialog.return, game)"
          @delete="(game) => openDialog(Dialog.delete, game)"
          @history="(game) => openDialog(Dialog.history, game)"
        />
      </template>
    </DataTable>
  </div>

  <!-- Floating Add Button -->
  <div
    class="group fixed bottom-0 right-0 flex items-end justify-end w-24 h-24 p-1"
  >
    <button
      class="z-50 rounded-full text-gray-900 dark:text-gray-200 text-nowrap absolute mr-4 mb-4 py-4 px-4 font-semibold dark:bg-gray-800/90 backdrop-blur-2xl bg-gray-50/90 ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden shadow-2xl transition-colors"
      @click="() => openDialog(Dialog.add)"
    >
      <IconPlus stroke="2.5" class="size-6 inline-block" />
    </button>
  </div>

  <!-- Dialogs -->
  <DialogAddGame :open="shownDialog === Dialog.add" @close="closeDialog" />

  <DialogWithdrawGame
    :open="shownDialog === Dialog.withdraw"
    :game="selectedGame"
    @close="closeDialog"
  />

  <DialogReturnGame
    :open="shownDialog === Dialog.return"
    :selected-game="selectedGame"
    @close="closeDialog"
  />

  <DialogDeleteGame
    :open="shownDialog === Dialog.delete"
    :selected-game="selectedGame"
    @close="closeDialog"
  />

  <DialogMoveGame
    :open="shownDialog === Dialog.move"
    :selected-game="selectedGame"
    @close="closeDialog"
  />

  <DialogReservedGame
    :open="shownDialog === Dialog.reservation"
    :reservation="selectedReservation"
    @close="closeDialog"
  />

  <DialogGameHistory
    :open="shownDialog === Dialog.history"
    :selected-game="selectedGame"
    @close="closeDialog"
  />

  <DialogEditGame
    :open="shownDialog === Dialog.edit"
    :game="selectedGame"
    @close="closeDialog"
  />
</template>

<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue'
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { IconSearch, IconNumber } from '@tabler/icons-vue'
import { useI18n } from 'vue-i18n'

import DataTable from '@/components/DataTable.vue'
import CInput from '@/components/CInput.vue'
import { getStatus, type LibraryGame } from '@/features/library/game.model.ts'
import type { DataTableColumn } from '@/components/DataTable.vue'
import libraryReservationService from '@/features/library/reservations/service.ts'
import GameActions from '@/views/admin/library/GameActions.vue'
import GameStatus from '@/views/admin/library/GameStatus.vue'
import type { LibraryReservation } from '@/features/library/reservations/service'
import DialogMoveGame from '@/views/admin/library/DialogMoveGame.vue'
import DialogDeleteGame from '@/views/admin/library/DialogDeleteGame.vue'
import DialogReturnGame from '@/views/admin/library/DialogReturnGame.vue'
import DialogReservedGame from '@/views/admin/library/DialogReservedGame.vue'
import DialogWithdrawGame from '@/views/admin/library/DialogWithdrawGame.vue'
import DialogAddGame from '@/views/admin/library/DialogAddGame.vue'
import DialogGameHistory from '@/views/admin/library/DialogGameHistory.vue'
import DialogEditGame from '@/views/admin/library/DialogEditGame.vue'
import libraryService from '@/features/library/service.ts'

const { t } = useI18n()

enum Dialog {
  add,
  withdraw,
  return,
  move,
  edit,
  delete,
  reservation,
  history,
}

// Data
const shownDialog = ref<Dialog | null>(null)
const allGames = ref<LibraryGame[]>([])
const selectedGame = ref<LibraryGame | null>(null)
const searchInput = ref('')
const reservationInput = ref('')
const loadingReservation = ref(false)
const searchQuery = ref('')
const selectedReservation = ref<LibraryReservation | null>(null)
let unsubscribe: (() => void) | null = null

// Table column definitions
const tableColumns = computed((): DataTableColumn<LibraryGame>[] => [
  {
    key: 'name',
    label: t('admin.library.name'),
    sortable: true,
    sortFn: (a: LibraryGame, b: LibraryGame): number => {
      return a.game.name.localeCompare(b.game.name)
    },
  },
  {
    key: 'status',
    label: t('admin.library.status'),
    cellClass: 'whitespace-nowrap',
    sortable: true,
    sortFn: (a: LibraryGame, b: LibraryGame): number => {
      return getStatus(a).localeCompare(getStatus(b))
    },
  },
  {
    key: 'location',
    label: t('admin.library.location'),
    breakpoint: 'md',
    sortable: true,
    cellClass: 'whitespace-nowrap',
    sortFn: (a: LibraryGame, b: LibraryGame): number => {
      const aName = a.location?.name ?? null
      const bName = b.location?.name ?? null

      if (!aName && !bName) return 0
      if (!aName) return 1
      if (!bName) return -1
      return aName.localeCompare(bName)
    },
  },
  {
    key: 'players',
    label: t('admin.library.players'),
    breakpoint: '2xl',
    cellClass: 'whitespace-nowrap',
  },
  {
    key: 'playtime',
    label: t('admin.library.playtime'),
    breakpoint: '2xl',
    cellClass: 'whitespace-nowrap',
  },
  {
    key: 'age',
    label: t('admin.library.age'),
    breakpoint: '2xl',
    cellClass: 'whitespace-nowrap',
  },
  {
    key: 'owner',
    label: t('admin.library.owner'),
    breakpoint: 'md',
    sortable: true,
    cellClass: 'whitespace-nowrap',
  },
])

// Debounced search query
const setSearchQuery = useDebounceFn((val: string) => {
  searchQuery.value = val.trim().toLowerCase()
}, 250)

// Watch search input and update debounced query
watch(searchInput, (val) => {
  void setSearchQuery(val)
})

// Filtered games based on search
const filteredGames = computed(() => {
  const q = searchQuery.value
  if (!q) return allGames.value
  return allGames.value.filter((g) => {
    const name = (g.game.name || '').toLowerCase()
    return name.includes(q)
  })
})

const openDialog = (dialog: Dialog, game?: LibraryGame): void => {
  shownDialog.value = dialog
  if (game) selectedGame.value = game
}

const closeDialog = (): void => {
  shownDialog.value = null
  selectedGame.value = null
}

// Reservation lookup (debounced)
const handleReservationChange = useDebounceFn(
  async (reservationNumber: string): Promise<void> => {
    if (!reservationNumber.trim()) return
    loadingReservation.value = true
    try {
      const result =
        await libraryReservationService.getByDisplayId(reservationNumber)

      selectedReservation.value = result
      shownDialog.value = Dialog.reservation
    } catch {
      toast.error(t('admin.library.reservationNotFound'))
    } finally {
      loadingReservation.value = false
      reservationInput.value = ''
    }
  },
  300,
)

watch(reservationInput, (newVal) => {
  void handleReservationChange(newVal)
})

// Lifecycle
onMounted(() => {
  // subscribe to service updates
  unsubscribe = libraryService.subscribeToUpdates((updatedGames) => {
    allGames.value = updatedGames || []
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

// Image handlers
const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

const handleImageLoad = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.style.display = 'block'
}

// Helper for location display
const getLocationName = (g: LibraryGame): string => {
  return (g.location && g.location.name) || '-'
}

const getRange = (min: number, max: number): string => {
  if (min === max) return String(min)
  else return `${min} - ${max}`
}
</script>
