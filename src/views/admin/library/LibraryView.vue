<template>
  <div class="px-4 py-3">
    <CInput id="test" label="" placeholder="Search" model-value=""></CInput>
  </div>

  <div class="flex flex-col h-full overflow-hidden">
    <DataTable
      :items="filteredGames"
      :columns="tableColumns"
      :items-per-page="25"
    >
      <!-- Header slot with search functionality -->
      <template #header>
        <SearchBar
          v-model:search-value="searchInput"
          search-placeholder="Search games..."
          search-label="Search"
        >
          <template #additional-inputs>
            <!-- Reservation quick-search (required) -->
            <div class="grid flex-1 grid-cols-1 max-w-xs">
              <input
                v-model="reservationInput"
                type="text"
                name="reservation"
                aria-label="Reservation"
                class="col-start-1 row-start-1 block bg-white dark:bg-gray-800 pl-8 text-base text-gray-900 dark:text-white outline-hidden placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-md"
                placeholder="Reservation"
              />
              <span
                class="pointer-events-none col-start-1 row-start-1 text-2xl self-center text-gray-400 dark:text-gray-500"
                aria-hidden="true"
                >#</span
              >
            </div>
          </template>
        </SearchBar>
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
              {{ item.game.name }}
            </div>
            <div class="mt-1 text-gray-500 dark:text-gray-400">
              {{ item.game.year }}
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
        {{ getLocationName(item) }}
      </template>

      <!-- Custom cell for players -->
      <template #cell-players="{ item }">
        {{ getRange(item.game.min_players, item.game.max_players) }}
      </template>

      <!-- Custom cell for playtime -->
      <template #cell-playtime="{ item }">
        {{ getRange(item.game.min_playtime, item.game.max_playtime) }}
      </template>

      <!-- Custom cell for age -->
      <template #cell-age="{ item }">
        {{ item.game.min_age ? item.game.min_age + '+' : '-' }}
      </template>

      <!-- Custom cell for owner -->
      <template #cell-owner="{ item }">
        {{ item.owner }}
      </template>

      <!-- Actions slot -->
      <template #actions="{ item }">
        <GameActions
          :data="item"
          @update-game="updateGame"
          @withdraw-game="openWithdrawDialog"
          @return-game="openReturnConfirmDialog"
        />
      </template>
    </DataTable>
  </div>

  <!-- Floating Add Button -->
  <div
    class="group fixed bottom-20 lg:bottom-0 right-0 p-2 flex items-end justify-end w-24 h-24"
  >
    <button
      class="z-50 rounded-full text-nowrap absolute shadow-xl mr-4 mb-4 py-4 px-6 font-semibold bg-slate-500 dark:bg-slate-600 text-slate-50 hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors"
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

  <ConfirmationDialog
    :open="returnConfirmDialogOpen"
    title="Return Game"
    message="Are you sure you want to return this game?"
    confirm-text="Yes, return it"
    cancel-text="Cancel"
    :loading="isReturningGame"
    @confirm="returnGame(gameToReturn)"
    @cancel="returnConfirmDialogOpen = false"
    @close="returnConfirmDialogOpen = false"
  />
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { toast } from 'vue-sonner'

import DataTable from '@/components/DataTable.vue'
import SearchBar from '@/components/SearchBar.vue'
import DialogComponent from '@/components/DialogComponent.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import type { LibraryGame } from '@/features/library/game.model.ts'
import type { DataTableColumn } from '@/components/DataTable.vue'
import Service, { libraryService } from '@/features/library/service.ts'
import libraryWithdrawService from '@/features/library/withdraws/service.ts'
import libraryReservationService from '@/features/library/reservations/service.ts'
import AddLibraryGameView from '@/views/admin/library/AddLibraryGameView.vue'
import WithdrawGameView from '@/views/admin/library/WithdrawGameView.vue'
import GameActions from '@/views/admin/library/GameActions.vue'
import GameStatus from '@/views/admin/library/GameStatus.vue'
import CInput from '@/components/CInput.vue'

// Data
const allGames = ref<LibraryGame[]>([])
const open = ref(false)
const withdrawDialogOpen = ref(false)
const selectedGame = ref<LibraryGame | null>(null)
const returnConfirmDialogOpen = ref(false)
const gameToReturn = ref<LibraryGame | null>(null)
const isReturningGame = ref(false)
const searchInput = ref('')
const reservationInput = ref('')
const loadingReservation = ref(false)
const searchQuery = ref('')
let unsubscribe: (() => void) | null = null

console.log('LibraryView: Component is loading...')

// Table column definitions
const tableColumns: DataTableColumn[] = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'status',
    label: 'Status',
    cellClass: 'whitespace-nowrap',
  },
  {
    key: 'location',
    label: 'Location',
    breakpoint: 'md',
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
  gameToReturn.value = game
  returnConfirmDialogOpen.value = true
}

const onGameWithdrawn = (): void => {
  withdrawDialogOpen.value = false
  selectedGame.value = null
}

const returnGame = async (game: LibraryGame | null): Promise<void> => {
  if (!game) return

  isReturningGame.value = true
  try {
    await libraryWithdrawService.returnGame(game.id)
    toast.success(`Game ${game.game.name} has been returned to the library.`)
    returnConfirmDialogOpen.value = false
    gameToReturn.value = null
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
