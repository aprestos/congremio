<template>
  <DialogComponent :open="props.open" title="Move Game" @close="handleClose">
    <div v-if="props.selectedGame" class="space-y-6">
      <!-- Game Info -->
      <div class="flex items-center space-x-4">
        <div class="shrink-0">
          <img
            class="size-16 rounded-lg object-cover shadow-sm"
            :src="props.selectedGame.game.image"
            :alt="props.selectedGame.game.name"
            @error="handleImageError"
          />
        </div>
        <div class="flex-1 min-w-0">
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white truncate"
          >
            {{ props.selectedGame.game.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Current location: {{ currentLocationName }}
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
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isMoving || selectedLocationId === null"
          @click="handleMove"
        >
          <span v-if="isMoving">Moving...</span>
          <span v-else>Move Game</span>
        </button>
      </div>
    </div>
  </DialogComponent>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import DialogComponent from '@/components/DialogComponent.vue'
import CSelect from '@/components/CSelect.vue'
import type { LibraryGame } from '@/features/library/game.model.ts'
import type { LibraryLocation } from '@/features/library/locations/location.model.ts'

interface Props {
  open?: boolean
  selectedGame?: LibraryGame | null
  locations?: LibraryLocation[]
  onMove: (locationId: number) => Promise<void>
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  selectedGame: null,
  locations: () => [],
})

const emit = defineEmits<Emits>()

const selectedLocationId = ref<number | null>(null)
const isMoving = ref(false)

// Watch for selectedGame changes to update the selected location
watch(
  () => props.selectedGame,
  (game) => {
    if (game) {
      selectedLocationId.value = game.location?.id || null
    }
  },
  { immediate: true },
)

// Computed properties
const locationOptions = computed(() => {
  return props.locations.map((loc: LibraryLocation) => ({
    value: loc.id,
    label: loc.name,
  }))
})

const currentLocationName = computed(() => {
  if (!props.selectedGame?.location) return '-'
  return props.selectedGame.location.name
})

// Event handlers
const handleClose = (): void => {
  selectedLocationId.value = null
  emit('close')
}

const handleMove = async (): Promise<void> => {
  if (selectedLocationId.value === null) return

  isMoving.value = true
  try {
    await props.onMove(selectedLocationId.value)
    selectedLocationId.value = null
    emit('close')
  } finally {
    isMoving.value = false
  }
}

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>
