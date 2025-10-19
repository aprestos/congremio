<script setup lang="ts">
import {
  getStatus,
  type LibraryGame,
  type LibraryGameStatus,
} from '@/features/library/game.model.ts'
import {
  IconArrowBarUp,
  IconArrowBarToDownDashed,
  IconChevronsRight,
  IconCircleCheck,
  IconArchive,
  IconTrash,
  IconEdit,
  IconDotsVertical,
} from '@tabler/icons-vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
// Use function overload signatures for defineEmits so we can have optional userId for withdraw-game
const emit = defineEmits<{
  (e: 'update-game', id: number, game: Partial<LibraryGame>): void
  (e: 'delete-game', gameId: number): void
  (e: 'open-update-dialog', game: LibraryGame): void
  (e: 'return-game', game: LibraryGame): void
  (e: 'withdraw-game', game: LibraryGame, userId?: string): void
  (e: 'move', game: LibraryGame): void
}>()

const props = defineProps<{ data: LibraryGame }>()

const updateStatus = (status: LibraryGameStatus): void => {
  // Close the dialog - realtime will handle the list update
  const updatedGame: Partial<LibraryGame> = { status }
  emit('update-game', props.data.id, updatedGame)
}
</script>

<template>
  <div class="text-right">
    <span class="inline-flex rounded-md shadow-xs dark:shadow-none">
      <button
        v-show="getStatus(props.data) === 'withdrawn'"
        type="button"
        class="relative inline-flex items-center gap-x-1.5 rounded-l-md bg-gray-100 px-4 py-3 md:px-3 md:py-2 text-sm font-semibold shadow-xs text-gray-600 dark:text-gray-200 ring-1 ring-gray-300 ring-inset hover:bg-gray-200 dark:bg-white/10 dark:ring-gray-700 dark:hover:bg-white/20"
        @click="emit('return-game', props.data)"
      >
        <IconArrowBarToDownDashed class="-ml-0.5 size-5" aria-hidden="true" />
        <span class="hidden md:inline">Return</span>
      </button>
      <button
        v-show="getStatus(props.data) === 'available'"
        type="button"
        class="relative inline-flex items-center gap-x-1.5 rounded-l-md bg-gray-100 px-4 py-3 md:px-3 md:py-2 text-sm font-semibold shadow-xs text-gray-600 dark:text-gray-200 ring-1 ring-gray-300 ring-inset hover:bg-gray-200 dark:bg-white/10 dark:ring-gray-700 dark:hover:bg-white/20"
        @click="emit('withdraw-game', props.data)"
      >
        <IconArrowBarUp class="-ml-0.5 size-5" aria-hidden="true" />
        <span class="hidden md:inline">Loan</span>
      </button>
      <Menu as="div" class="relative inline-block">
        <MenuButton
          class="inline-flex w-full justify-center -ml-px gap-x-1.5 rounded-r-md ring-1 ring-gray-300 ring-inset bg-gray-100 px-4 py-3 md:px-3 md:py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:ring-gray-700 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20"
        >
          <IconDotsVertical class="size-5" />
        </MenuButton>

        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="absolute right-0 z-15 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg outline-1 outline-black/5 dark:divide-white/10 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
          >
            <div class="py-1 hidden">
              <MenuItem v-slot="{ active }" class="cursor-not-allowed">
                <a
                  :class="[
                    active
                      ? 'bg-gray-100 text-gray-900 outline-hidden dark:bg-white/5 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300',
                    'flex items-center px-4 py-2 text-sm',
                  ]"
                  @click="emit('open-update-dialog', props.data)"
                >
                  <IconEdit
                    :class="[
                      active
                        ? 'text-gray-500 dark:text-white'
                        : 'text-gray-400 dark:text-gray-500',
                      'mr-3 size-5',
                    ]"
                    aria-hidden="true"
                  />
                  Edit
                </a>
              </MenuItem>
            </div>
            <div class="py-1">
              <MenuItem
                v-show="getStatus(props.data) === 'not-available'"
                v-slot="{ active }"
              >
                <a
                  :class="[
                    active
                      ? 'bg-gray-100 text-gray-900 outline-hidden dark:bg-white/5 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300',
                    'flex items-center px-4 py-2 text-sm',
                  ]"
                  @click="updateStatus('available' as LibraryGameStatus)"
                >
                  <IconCircleCheck
                    :class="[
                      active
                        ? 'text-gray-500 dark:text-white'
                        : 'text-gray-400 dark:text-gray-500',
                      'mr-3 size-5',
                    ]"
                    aria-hidden="true"
                  />
                  Mark as available
                </a>
              </MenuItem>
              <MenuItem
                v-show="getStatus(props.data) === 'available'"
                v-slot="{ active }"
              >
                <a
                  :class="[
                    active
                      ? 'bg-gray-100 text-gray-900 outline-hidden dark:bg-white/5 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300',
                    'flex items-center px-4 py-2 text-sm',
                  ]"
                  @click="updateStatus('not-available' as LibraryGameStatus)"
                >
                  <IconArchive
                    :class="[
                      active
                        ? 'text-gray-500 dark:text-white'
                        : 'text-gray-400 dark:text-gray-500',
                      'mr-3 size-5',
                    ]"
                    aria-hidden="true"
                  />
                  Mark as not available
                </a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a
                  :class="[
                    active
                      ? 'bg-gray-100 text-gray-900 outline-hidden dark:bg-white/5 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300',
                    'flex items-center px-4 py-2 text-sm',
                  ]"
                  @click="emit('move', props.data)"
                >
                  <IconChevronsRight
                    :class="[
                      active
                        ? 'text-gray-500 dark:text-white'
                        : 'text-gray-400 dark:text-gray-500',
                      'mr-3 size-5',
                    ]"
                    aria-hidden="true"
                  />
                  Move
                </a>
              </MenuItem>
            </div>
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <a
                  :class="[
                    active
                      ? 'bg-gray-100 text-gray-900 outline-hidden dark:bg-white/5 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300',
                    'flex items-center px-4 py-2 text-sm',
                  ]"
                  @click="emit('delete-game', props.data.id)"
                >
                  <IconTrash
                    :class="[
                      active
                        ? 'text-gray-500 dark:text-white'
                        : 'text-gray-400 dark:text-gray-500',
                      'mr-3 size-5',
                    ]"
                    aria-hidden="true"
                  />
                  Delete
                </a>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </span>
  </div>
</template>

<style scoped></style>
