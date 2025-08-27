<template>
  <div
    class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white dark:bg-gray-900 dark:border-white/5 border-b border-gray-200 px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8"
  >
    <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
      <form
        class="grid flex-1 grid-cols-1"
        @submit.prevent="handleSearchSubmit"
      >
        <input
          type="search"
          name="search"
          aria-label="Search"
          v-model="searchInput"
          class="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
          placeholder="Search games..."
        />
        <MagnifyingGlassIcon
          class="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
          aria-hidden="true"
        />
      </form>
      <div class="flex items-center gap-x-4 lg:gap-x-6">
        <!-- Separator -->
        <div
          class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
          aria-hidden="true"
        />

        <!-- Filter dropdown -->
        <select class="text-sm border-gray-300 rounded-md">
          <option value="">All</option>
          <option value="name">Name</option>
          <option value="owner">Owner</option>
          <option value="location">Location</option>
        </select>
      </div>
    </div>
  </div>

  <div class="px-4 sm:gap-x-6 sm:px-0">
    <div class="-mx-4 sm:-mx-0">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-white/15">
        <thead>
          <tr>
            <th
              scope="col"
              class="pl-4 sm:pl-6 lg:pl-8 py-3 pr-3 text-left text-xs text-gray-500 uppercase"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-3 py-4 text-left text-xs text-gray-500 uppercase table-cell"
            >
              Status
            </th>
            <th
              scope="col"
              class="hidden px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase lg:table-cell"
            >
              Location
            </th>
            <th
              scope="col"
              class="hidden px-3 py-4 text-left text-xs text-gray-500 uppercase lg:table-cell"
            >
              Players
            </th>
            <th
              scope="col"
              class="hidden px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase lg:table-cell"
            >
              Playtime
            </th>
            <th scope="col" class="relative py-4 pr-4 sm:pr-6 lg:pr-8 pl-3">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-white/10">
          <tr v-for="game in games" :key="game.id"></tr>
          <tr v-for="game in games" :key="game.id">
            <td
              class="pl-4 sm:pl-6 lg:pl-8 py-5 pr-3 text-sm whitespace-nowrap"
            >
              <div class="flex items-center">
                <div class="size-11 shrink-0">
                  <img
                    class="size-11 rounded-sm"
                    :src="game.game.image"
                    alt=""
                  />
                </div>
                <div class="ml-4">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ game.game.name }}
                  </div>
                  <div class="mt-1 text-gray-500">{{ game.game.year }}</div>
                </div>
              </div>
            </td>
            <td class="px-3 py-4 text-sm">
              <div class="flex items-center">
                <CBadge
                  v-show="game.status === 'available'"
                  :text="game.status"
                  type="green"
                />
                <CBadge
                  v-show="game.status === 'withdrawn'"
                  :text="game.status"
                  type="yellow"
                />
                <CBadge
                  v-show="game.status === 'not-available'"
                  :text="game.status"
                  type="red"
                />
              </div>
            </td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
              {{ game.location?.name || "-" }}
            </td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
              {{ game.game.min_players }} - {{ game.game.max_players }}
            </td>
            <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
              {{ game.game.min_playtime }} - {{ game.game.max_playtime }}
            </td>
            <td
              class="py-4 pr-4 sm:pr-6 lg:pr-8 pl-3 text-right text-sm font-medium"
            >
              <button
                v-show="game.status === 'available'"
                class="ml-2 p-3 text-gray-400 bg-yellow-50 dark:hover:bg-yellow-500/20 dark:bg-yellow-200/20 hover:text-yellow-500 hover:bg-yellow-200 rounded transition-colors"
                @click="openWithdrawDialog(game)"
                :title="'Withdraw ' + game.game.name"
              >
                <ArrowRightStartOnRectangleIcon class="size-5" />
              </button>
              <button
                v-show="game.status === 'withdrawn'"
                class="ml-2 p-3 text-gray-400 bg-green-50 dark:hover:bg-green-500/20 dark:bg-green-200/20 hover:text-green-500 rounded transition-colors"
                @click="returnGame(game)"
                :title="'Withdraw ' + game.game.name"
              >
                <ArrowRightEndOnRectangleIcon class="size-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div
    class="group fixed bottom-20 lg:bottom-0 right-0 p-2 flex items-end justify-end w-24 h-24"
  >
    <button
      class="z-50 rounded-4xl text-nowrap absolute shadow-xl mr-4 mb-4 py-4 px-6 font-semibold bg-slate-500 text-slate-50 hover:bg-slate-700 transition-colors"
      @click="
        open = true;
        toast.success('test');
      "
    >
      <PlusIcon class="size-6 inline-block" />
      Add
    </button>
  </div>

  <DialogComponent :open="open" title="Add a library game">
    <AddLibraryGameView @game-added="onGameAdded" @close="open = false" />
  </DialogComponent>

  <DialogComponent
    :open="withdrawDialogOpen"
    title="Withdraw Game"
    @close="withdrawDialogOpen = false"
  >
    <WithdrawGameView
      v-if="selectedGameForWithdraw"
      :game="selectedGameForWithdraw"
      @game-withdrawn="onGameWithdrawn"
      @close="withdrawDialogOpen = false"
    />
  </DialogComponent>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, onUnmounted, ref } from "vue";
//import { toast } from "vue3-toastify";
import { toast } from "vue-sonner";

import CBadge from "@/components/CBadge.vue";
import DialogComponent from "@/components/DialogComponent.vue";
import { useSearch } from "@/composables/useSearch.ts";
import type { LibraryGame } from "@/features/library/game.model.ts";
import Service from "@/features/library/service.ts";
import libraryWithdrawService from "@/features/library/withdraws/service.ts";
import AddLibraryGameView from "@/views/admin/library/AddLibraryGameView.vue";
import WithdrawGameView from "@/views/admin/library/WithdrawGameView.vue";

const games = ref<LibraryGame[]>([]);
const open = ref(false);
const withdrawDialogOpen = ref(false);
const selectedGameForWithdraw = ref<LibraryGame | null>(null);
const isSearching = ref(false);
const searchInput = ref("");
let unsubscribe: (() => void) | null = null;

const { setSearchHandler, clearSearchHandler } = useSearch();

const onGameAdded = () => {
  // Close the dialog - realtime will handle the list update
  open.value = false;
};

const handleSearch = async (query: string) => {
  if (!query.trim()) {
    // If empty search, reload all games
    const allGames = await Service.get();
    games.value = allGames;
    isSearching.value = false;
    return;
  }

  isSearching.value = true;
  try {
    const searchResults = await Service.search(query);
    games.value = searchResults;
  } catch (error) {
    console.error("Search failed:", error);
  } finally {
    isSearching.value = false;
  }
};

const handleSearchSubmit = (event: Event) => {
  event.preventDefault();
  handleSearch(searchInput.value);
};

onMounted(() => {
  // Register search handler for this view
  setSearchHandler(handleSearch);
});

// Set up subscription with automatic initial load and updates
unsubscribe = Service.subscribeToUpdates((updatedGames) => {
  // Only update if not currently searching
  if (!isSearching.value) {
    games.value = updatedGames;
  }
});

onUnmounted(() => {
  // Clean up the subscription when component is unmounted
  if (unsubscribe) {
    unsubscribe();
  }
  // Clear the search handler
  clearSearchHandler();
});

const openWithdrawDialog = (game: LibraryGame) => {
  selectedGameForWithdraw.value = game;
  withdrawDialogOpen.value = true;
};

const onGameWithdrawn = async () => {
  // Close the dialog - realtime will handle the list update
  withdrawDialogOpen.value = false;
  selectedGameForWithdraw.value = null;
};

const returnGame = async (game: LibraryGame) => {
  await libraryWithdrawService.returnGame(game.id);
  toast.success(`Game ${game.game.name} has been returned to the library.`);
};
</script>
