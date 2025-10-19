<template>
  <div class="flex flex-col h-full">
    <DataTable
      :items="filteredGames"
      :columns="tableColumns"
      :items-per-page="25"
    >
      <template #header>
        <div class="flex flex-row px-4 py-3 gap-4">
          <div class="flex-1 mt-2 grid grid-cols-1">
            <input
              id="search"
              v-model="searchInput"
              aria-label="Search"
              placeholder="Search"
              type="text"
              name="search"
              class="col-start-1 row-start-1 block rounded-md bg-white py-3 pr-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
            />
            <IconSearch
              class="pointer-events-none col-start-1 row-start-1 ml-3 size-4 self-center text-gray-400 sm:size-5 dark:text-gray-500"
              aria-hidden="true"
            />
          </div>
          <div class="mt-2 grid grid-cols-1">
            <input
              id="reservation"
              v-model="reservationInput"
              type="text"
              name="reservation"
              class="col-start-1 row-start-1 block rounded-md bg-white py-3 pr-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              placeholder="Reservation"
              aria-label="Reservation"
            />
            <IconNumber
              class="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-5 dark:text-gray-500"
              aria-hidden="true"
            />
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
        />
      </template>
    </DataTable>
  </div>

  <!-- Floating Add Button -->
  <div
    class="group fixed bottom-5 lg:bottom-0 right-0 flex items-end justify-end w-24 h-24"
  >
    <button
      class="z-50 bg-opacity-10 backdrop-blur-2xl rounded-full text-nowrap absolute shadow-xl mr-4 mb-4 py-4 px-6 font-semibold bg-slate-500/10 dark:bg-slate-600 text-slate-50 hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors"
      @click="open = true"
    >
      <PlusIcon class="size-6 inline-block" />
      Add
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
    :is-returning-game="isReturningGame"
    @confirm="returnGame"
    @cancel="returnConfirmDialogOpen = false"
    @close="returnConfirmDialogOpen = false"
  />

  <DeleteGameDialog
    :open="deleteConfirmDialogOpen"
    :selected-game="selectedGame"
    :is-loading-withdraw-count="isLoadingWithdrawCount"
    :withdraw-count="withdrawCount"
    :is-deleting-game="isDeletingGame"
    @close="closeDeleteDialog"
    @confirm="deleteGame"
  />

  <DialogComponent
    :open="moveDialogOpen"
    title="Move Game"
    @close="cancelMoveGame"
  >
    <div v-if="selectedGame" class="space-y-6">
      <!-- Game Info -->
      <div class="flex items-center space-x-4">
        <div class="shrink-0">
          <img
            class="size-16 rounded-lg object-cover shadow-sm"
            :src="selectedGame.game.image"
            :alt="selectedGame.game.name"
            @error="handleImageError"
          />
        </div>
        <div class="flex-1 min-w-0">
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white truncate"
          >
            {{ selectedGame.game.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Current location: {{ getLocationName(selectedGame) }}
          </p>
        </div>
      </div>

      <!-- Location Selection -->
      <CSelect
        id="location"
        v-model="selectedLocationId"
        label="New Location"
        :options="locationOptions"
        placeholder="Select a location"
      />

      <!-- Actions -->
      <div class="flex gap-3 justify-end">
        <button
          type="button"
          class="rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          @click="cancelMoveGame"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isMovingGame || selectedLocationId === null"
          @click="moveGame"
        >
          <span v-if="isMovingGame">Moving...</span>
          <span v-else>Move Game</span>
        </button>
      </div>
    </div>
  </DialogComponent>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { IconSearch, IconNumber } from '@tabler/icons-vue'

import DataTable from '@/components/DataTable.vue'
import DialogComponent from '@/components/DialogComponent.vue'
import CSelect from '@/components/CSelect.vue'
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
import { libraryLocationService } from '@/features/library/locations/service.ts'
import type { LibraryLocation } from '@/features/library/locations/location.model.ts'

// Data
const allGames = ref<LibraryGame[]>([])
const open = ref(false)
const withdrawDialogOpen = ref(false)
const selectedGame = ref<LibraryGame | null>(null)
const returnConfirmDialogOpen = ref(false)
const isReturningGame = ref(false)
const searchInput = ref('')
const reservationInput = ref('')
const loadingReservation = ref(false)
const searchQuery = ref('')
const moveDialogOpen = ref(false)
const selectedLocationId = ref<number | null>(null)
const locations = ref<LibraryLocation[]>([])
const isMovingGame = ref(false)
const deleteConfirmDialogOpen = ref(false)
const isDeletingGame = ref(false)
const withdrawCount = ref<number | null>(null)
const isLoadingWithdrawCount = ref(false)
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
  },
  {
    key: 'players',
    label: 'Players',
    breakpoint: 'xl',
    cellClass: 'whitespace-nowrap',
  },
  {
    key: 'playtime',
    label: 'Playtime',
    breakpoint: 'xl',
    cellClass: 'whitespace-nowrap',
  },
  {
    key: 'age',
    label: 'Age',
    breakpoint: 'xl',
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
        toast.success('Reservation found')
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
    console.log(
      'LibraryView: Received games update:',
      updatedGames?.length || 0,
    )
    allGames.value = updatedGames || []
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

// Add watchers for debugging
watch(
  allGames,
  (newGames) => {
    console.log('LibraryView: allGames updated to', newGames.length, 'items')
  },
  { immediate: true },
)

watch(
  filteredGames,
  (newFilteredGames) => {
    console.log(
      'LibraryView: filteredGames updated to',
      newFilteredGames.length,
      'items',
    )
  },
  { immediate: true },
)

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

  isReturningGame.value = true
  try {
    await libraryWithdrawService.returnGame(selectedGame.value.id)
    toast.success(
      `${selectedGame.value.game.name} has been returned to the library.`,
    )
    returnConfirmDialogOpen.value = false
    selectedGame.value = null
  } catch (error) {
    console.error('Failed to return game:', error)
    toast.error('Failed to return the game. Please try again.')
  } finally {
    isReturningGame.value = false
  }
}

const updateGame = async (
  id: number,
  updatedGame: Partial<LibraryGame>,
): Promise<void> => {
  await libraryService.updateGame(id, updatedGame)
}

const openMoveGameDialog = async (game: LibraryGame): Promise<void> => {
  selectedGame.value = game
  selectedLocationId.value = game.location?.id || null

  // Load locations
  try {
    locations.value = await libraryLocationService.get()
    moveDialogOpen.value = true
  } catch (error) {
    console.error('Failed to load locations:', error)
    toast.error('Failed to load locations. Please try again.')
  }
}

const moveGame = async (): Promise<void> => {
  if (!selectedGame.value || selectedLocationId.value === null) return

  isMovingGame.value = true
  try {
    // Update with raw database column name since we're updating directly
    await libraryService.updateGame(selectedGame.value.id, {
      location_id: selectedLocationId.value,
    } as Partial<LibraryGame>)
    toast.success(
      `${selectedGame.value.game.name} has been moved to a new location.`,
    )
    moveDialogOpen.value = false
    selectedGame.value = null
    selectedLocationId.value = null
  } catch (error) {
    console.error('Failed to move game:', error)
    toast.error('Failed to move the game. Please try again.')
  } finally {
    isMovingGame.value = false
  }
}

const cancelMoveGame = (): void => {
  moveDialogOpen.value = false
  selectedGame.value = null
  selectedLocationId.value = null
}

// Delete game handlers
const openDeleteConfirmDialog = async (gameId: number): Promise<void> => {
  const game = allGames.value.find((g) => g.id === gameId)
  if (game) {
    selectedGame.value = game
    deleteConfirmDialogOpen.value = true

    // Fetch withdraw count
    isLoadingWithdrawCount.value = true
    withdrawCount.value = null
    try {
      withdrawCount.value = await libraryWithdrawService.countByGame(gameId)
    } catch (error) {
      console.error('Failed to fetch withdraw count:', error)
      toast.error('Failed to check game withdraw history')
    } finally {
      isLoadingWithdrawCount.value = false
    }
  }
}

const closeDeleteDialog = (): void => {
  deleteConfirmDialogOpen.value = false
  selectedGame.value = null
  withdrawCount.value = null
}

const deleteGame = async (): Promise<void> => {
  if (!selectedGame.value) return

  isDeletingGame.value = true
  try {
    await libraryService.deleteGame(selectedGame.value.id)
    toast.success(
      `${selectedGame.value.game.name} has been deleted from the library.`,
    )
    deleteConfirmDialogOpen.value = false
    selectedGame.value = null
    withdrawCount.value = null
  } catch (error) {
    console.error('Failed to delete game:', error)
    toast.error('Failed to delete the game. Please try again.')
  } finally {
    isDeletingGame.value = false
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

// Computed options for location select
const locationOptions = computed(() => {
  return locations.value?.map((loc: LibraryLocation) => ({
    value: loc.id,
    label: loc.name,
  }))
})
</script>
