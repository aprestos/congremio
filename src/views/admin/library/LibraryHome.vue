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
              placeholder="Search"
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
              placeholder="Reservation"
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
          @move="openMoveGameDialog"
          @update-game="updateGame"
          @withdraw-game="openWithdrawDialog"
          @return-game="openReturnConfirmDialog"
          @delete-game="openDeleteConfirmDialog"
          @open-history-dialog="openHistoryDialog"
        />
      </template>
    </DataTable>
  </div>

  <!-- Floating Add Button -->
  <div
    class="group fixed bottom-0 right-0 flex items-end justify-end w-24 h-24 p-1"
  >
    <button
      class="z-50 bg-black/10 backdrop-blur-lg rounded-full text-nowrap absolute shadow-xl mr-4 mb-4 py-4 px-4 font-semibold dark:bg-slate-600 text-gray-600 hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors"
      @click="open = true"
    >
      <IconPlus stroke="2.5" class="size-6 inline-block" />
    </button>
  </div>

  <!-- Dialogs -->
  <DialogComponent :open="open" title="Add a library game">
    <AddLibraryGameView @game-added="onGameAdded" @close="open = false" />
  </DialogComponent>

  <DialogComponent
    :open="withdrawDialogOpen"
    title="Withdraw Game"
    @close="withdrawDialogOpen = false"
  >
    <WithdrawGameView
      v-if="selectedGame"
      :game="selectedGame"
      @game-withdrawn="onGameWithdrawn"
      @close="withdrawDialogOpen = false"
    />
  </DialogComponent>

  <ReturnGameDialog
    :open="returnConfirmDialogOpen"
    :selected-game="selectedGame"
    :on-confirm="returnGame"
    @cancel="returnConfirmDialogOpen = false"
    @close="returnConfirmDialogOpen = false"
  />

  <DeleteGameDialog
    :open="deleteConfirmDialogOpen"
    :selected-game="selectedGame"
    :on-load-withdraw-count="loadWithdrawCount"
    :on-confirm="deleteGame"
    @close="closeDeleteDialog"
  />

  <MoveGameDialog
    :open="moveDialogOpen"
    :selected-game="selectedGame"
    :locations="locations"
    :on-move="moveGame"
    @close="cancelMoveGame"
  />

  <ReservationGameDialog
    :open="reservationDialogOpen"
    :reservation="selectedReservation"
    @close="closeReservationDialog"
    @withdraw="handleReservationWithdraw"
  />

  <!-- History Dialog -->
  <DialogComponent
    :open="historyDialogOpen"
    title="Withdrawal History"
    size="lg"
    @close="closeHistoryDialog"
  >
    <WithdrawHistory v-if="selectedGameId" :library-game-id="selectedGameId" />
  </DialogComponent>
</template>

<script setup lang="ts">
import { IconPlus } from '@tabler/icons-vue'
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { IconSearch, IconNumber } from '@tabler/icons-vue'

import DataTable from '@/components/DataTable.vue'
import DialogComponent from '@/components/DialogComponent.vue'
import CInput from '@/components/CInput.vue'
import { getStatus, type LibraryGame } from '@/features/library/game.model.ts'
import type { DataTableColumn } from '@/components/DataTable.vue'
import Service, { libraryService } from '@/features/library/service.ts'
import libraryWithdrawService from '@/features/library/withdraws/service.ts'
import libraryReservationService from '@/features/library/reservations/service.ts'
import AddLibraryGameView from '@/views/admin/library/AddLibraryGameView.vue'
import WithdrawGameView from '@/views/admin/library/WithdrawGameView.vue'
import GameActions from '@/views/admin/library/GameActions.vue'
import GameStatus from '@/views/admin/library/GameStatus.vue'
import DeleteGameDialog from '@/views/admin/library/DeleteGameDialog.vue'
import ReturnGameDialog from '@/views/admin/library/ReturnGameDialog.vue'
import MoveGameDialog from '@/views/admin/library/MoveGameDialog.vue'
import ReservationGameDialog from '@/views/admin/library/ReservationGameDialog.vue'
import { libraryLocationService } from '@/features/library/locations/service.ts'
import type { LibraryLocation } from '@/features/library/locations/location.model.ts'
import type { LibraryReservation } from '@/features/library/reservations/service'
import WithdrawHistory from '@/views/public/WithdrawHistory.vue'

// Data
const allGames = ref<LibraryGame[]>([])
const open = ref(false)
const withdrawDialogOpen = ref(false)
const selectedGame = ref<LibraryGame | null>(null)
const returnConfirmDialogOpen = ref(false)
const searchInput = ref('')
const reservationInput = ref('')
const loadingReservation = ref(false)
const searchQuery = ref('')
const moveDialogOpen = ref(false)
const locations = ref<LibraryLocation[]>([])
const deleteConfirmDialogOpen = ref(false)
const reservationDialogOpen = ref(false)
const selectedReservation = ref<LibraryReservation | null>(null)
const historyDialogOpen = ref(false)
const selectedGameId = ref<number | null>(null)
let unsubscribe: (() => void) | null = null

// Table column definitions
const tableColumns: DataTableColumn<LibraryGame>[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    sortFn: (a: LibraryGame, b: LibraryGame): number => {
      return a.game.name.localeCompare(b.game.name)
    },
  },
  {
    key: 'status',
    label: 'Status',
    cellClass: 'whitespace-nowrap',
    sortable: true,
    sortFn: (a: LibraryGame, b: LibraryGame): number => {
      return getStatus(a).localeCompare(getStatus(b))
    },
  },
  {
    key: 'location',
    label: 'Location',
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
    label: 'Players',
    breakpoint: '2xl',
    cellClass: 'whitespace-nowrap',
  },
  {
    key: 'playtime',
    label: 'Playtime',
    breakpoint: '2xl',
    cellClass: 'whitespace-nowrap',
  },
  {
    key: 'age',
    label: 'Age',
    breakpoint: '2xl',
    cellClass: 'whitespace-nowrap',
  },
  {
    key: 'owner',
    label: 'Owner',
    breakpoint: 'md',
    sortable: true,
    cellClass: 'whitespace-nowrap',
  },
]

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

// Reservation lookup (debounced)
const handleReservationChange = useDebounceFn(
  async (reservationNumber: string): Promise<void> => {
    if (!reservationNumber.trim()) return
    loadingReservation.value = true
    try {
      const result =
        await libraryReservationService.getByDisplayId(reservationNumber)
      if (result) {
        selectedReservation.value = result
        reservationDialogOpen.value = true
      } else {
        toast.error('Reservation not found')
      }
    } catch (error) {
      console.error('Reservation lookup failed', error)
      toast.error('Reservation lookup failed')
    } finally {
      loadingReservation.value = false
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
  unsubscribe = Service.subscribeToUpdates((updatedGames) => {
    allGames.value = updatedGames || []
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

// Event handlers
const onGameAdded = (): void => {
  open.value = false
  toast.success('Game has been added to the library!')
}

const openWithdrawDialog = (game: LibraryGame): void => {
  selectedGame.value = game
  withdrawDialogOpen.value = true
}

const openReturnConfirmDialog = (game: LibraryGame): void => {
  selectedGame.value = game
  returnConfirmDialogOpen.value = true
}

const onGameWithdrawn = (): void => {
  withdrawDialogOpen.value = false
  selectedGame.value = null
}

const returnGame = async (): Promise<void> => {
  if (!selectedGame.value) return

  try {
    await libraryWithdrawService.returnGame(selectedGame.value.id)
    toast.success(
      `${selectedGame.value.game.name} has been returned to the library.`,
    )
    selectedGame.value = null
  } catch (error) {
    console.error('Failed to return game:', error)
    toast.error('Failed to return the game. Please try again.')
    throw error
  }
}

const updateGame = async (
  id: number,
  updatedGame: Partial<LibraryGame>,
): Promise<void> => {
  await libraryService.updateGame(id, updatedGame)
}

const moveGame = async (locationId: number): Promise<void> => {
  if (!selectedGame.value) return

  try {
    await libraryService.updateGame(selectedGame.value.id, {
      location_id: locationId,
    } as Partial<LibraryGame>)
    toast.success(
      `${selectedGame.value.game.name} has been moved to a new location.`,
    )
    selectedGame.value = null
  } catch (error) {
    console.error('Failed to move game:', error)
    toast.error('Failed to move the game. Please try again.')
    throw error
  }
}

const openMoveGameDialog = async (game: LibraryGame): Promise<void> => {
  selectedGame.value = game

  // Load locations
  try {
    locations.value = await libraryLocationService.get()
    moveDialogOpen.value = true
  } catch (error) {
    console.error('Failed to load locations:', error)
    toast.error('Failed to load locations. Please try again.')
  }
}

const cancelMoveGame = (): void => {
  moveDialogOpen.value = false
  selectedGame.value = null
}

// Reservation handlers
const closeReservationDialog = (): void => {
  reservationDialogOpen.value = false
  selectedReservation.value = null
  reservationInput.value = ''
}

const openHistoryDialog = (game: LibraryGame): void => {
  selectedGameId.value = game.id
  historyDialogOpen.value = true
}

const closeHistoryDialog = (): void => {
  historyDialogOpen.value = false
  selectedGameId.value = null
}

const handleReservationWithdraw = async (): Promise<void> => {
  // Find the game associated with this reservation
  const reservation = selectedReservation.value
  if (!reservation) return

  try {
    await libraryWithdrawService.create(
      selectedReservation.value?.library_game.id as number,
      selectedReservation.value?.user_id as string,
    )

    toast.success('Game withdrawn successfully')

    closeReservationDialog()
  } catch (error) {
    console.error('Failed to withdraw game: ', error)
    toast.error('Failed to withdraw the game. Please try again.')
  }
}

// Delete game handlers
const loadWithdrawCount = async (): Promise<number> => {
  if (!selectedGame.value) return 0
  return await libraryWithdrawService.countByGame(selectedGame.value.id)
}

const openDeleteConfirmDialog = (gameId: number): void => {
  const game = allGames.value.find((g) => g.id === gameId)
  if (game) {
    selectedGame.value = game
    deleteConfirmDialogOpen.value = true
  }
}

const closeDeleteDialog = (): void => {
  deleteConfirmDialogOpen.value = false
  selectedGame.value = null
}

const deleteGame = async (): Promise<void> => {
  if (!selectedGame.value) return

  try {
    await libraryService.deleteGame(selectedGame.value.id)
    toast.success(
      `${selectedGame.value.game.name} has been deleted from the library.`,
    )
    selectedGame.value = null
  } catch (error) {
    console.error('Failed to delete game:', error)
    toast.error('Failed to delete the game. Please try again.')
    throw error
  }
}

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
