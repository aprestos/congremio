<template>
  <DialogComponent :open="open" title="" @close="closeModal">
    <!-- Loading SkeletonLoader -->
    <div
      v-if="!game"
      class="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8"
    >
      <div class="sm:col-span-4 lg:col-span-5">
        <SkeletonLoader width="100%" height="300px" />
      </div>
      <div class="sm:col-span-8 lg:col-span-7">
        <SkeletonLoader width="70%" height="32px" class="mb-3" />

        <section aria-labelledby="information-heading" class="mt-3">
          <!-- Game Stats Skeletons -->
          <div class="space-y-3">
            <!-- Player Count SkeletonLoader -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <UsersIcon class="h-5 w-5 text-gray-400" />
                <SkeletonLoader width="100px" height="20px" />
              </div>
              <div class="ml-7 flex items-center gap-1">
                <SkeletonLoader width="200px" height="8px" />
              </div>
            </div>

            <div class="flex items-center gap-2">
              <ClockIcon class="h-5 w-5 text-gray-400" />
              <SkeletonLoader width="80px" height="20px" />
            </div>
            <div class="flex items-center gap-2">
              <CalendarIcon class="h-5 w-5 text-gray-400" />
              <SkeletonLoader width="60px" height="20px" />
            </div>
          </div>

          <!-- Description SkeletonLoader -->
          <div class="mt-6">
            <div class="flex items-center gap-2 mb-2">
              <DocumentTextIcon class="h-5 w-5 text-gray-400" />
              <SkeletonLoader width="100px" height="20px" />
            </div>
            <div class="space-y-2">
              <SkeletonLoader width="100%" height="16px" />
              <SkeletonLoader width="100%" height="16px" />
              <SkeletonLoader width="80%" height="16px" />
            </div>
          </div>
        </section>

        <section aria-labelledby="options-heading" class="mt-6">
          <div class="mt-6">
            <SkeletonLoader width="100%" height="48px" />
          </div>
        </section>
      </div>
    </div>

    <!-- Game Content -->
    <div
      v-else
      class="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8"
    >
      <div class="sm:col-span-4 lg:col-span-5">
        <img
          :src="game?.game?.image || ''"
          :alt="game?.game?.name || ''"
          class="w-full rounded-lg bg-gray-100 object-contain"
        />
      </div>
      <div class="sm:col-span-8 lg:col-span-7">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white sm:pr-12">
          {{ game?.game?.name }}
        </h2>

        <section aria-labelledby="information-heading" class="mt-3">
          <h3 id="information-heading" class="sr-only">Product information</h3>

          <!-- Game Stats with Icons -->
          <div class="space-y-3">
            <!-- Player Count with Visual Indicators -->
            <div class="space-y-2">
              <div
                class="flex items-center gap-2 text-gray-600 dark:text-gray-400"
              >
                <UsersIcon class="h-5 w-5 text-gray-400" />
                <span
                  >{{ game?.game?.min_players }}-{{
                    game?.game?.max_players
                  }}
                  players</span
                >
              </div>

              <!-- Player Count Visual Bar -->
              <div v-if="game?.game" class="ml-7 flex items-center gap-1">
                <template v-for="count in getPlayerCountRange()" :key="count">
                  <div
                    :class="[
                      'w-6 h-2 rounded-sm transition-colors',
                      getPlayerCountClass(count),
                    ]"
                    :title="getPlayerCountTooltip(count)"
                  />
                </template>

                <!-- Legend -->
                <div
                  class="ml-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                >
                  <div
                    v-if="game?.game?.best_at"
                    class="flex items-center gap-1"
                  >
                    <div class="w-2 h-2 rounded-sm bg-green-500"></div>
                    <span>Best</span>
                  </div>
                  <div
                    v-if="game?.game?.recommended_at"
                    class="flex items-center gap-1"
                  >
                    <div class="w-2 h-2 rounded-sm bg-blue-300"></div>
                    <span>Good</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex items-center gap-2 text-gray-600 dark:text-gray-400"
            >
              <ClockIcon class="h-5 w-5 text-gray-400" />
              <span
                >{{ game?.game?.min_playtime }}-{{
                  game?.game?.max_playtime
                }}
                min</span
              >
            </div>
            <div
              class="flex items-center gap-2 text-gray-600 dark:text-gray-400"
            >
              <CalendarIcon class="h-5 w-5 text-gray-400" />
              <span>Age {{ game?.game?.min_age }}+</span>
            </div>
          </div>

          <!-- Description -->
          <div class="mt-6">
            <h4
              class="flex items-center gap-2 font-medium text-gray-900 dark:text-white mb-2"
            >
              <DocumentTextIcon class="h-5 w-5 text-gray-400" />
              Description
            </h4>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              N/A
            </p>
          </div>
        </section>
      </div>
    </div>
  </DialogComponent>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import DialogComponent from '@/components/DialogComponent.vue'
import {
  UsersIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
} from '@heroicons/vue/20/solid'
import libraryService from '@/features/library/service.ts'
import type { LibraryGame } from '@/features/library/game.model.ts'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

interface Props {
  gameId: string
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

const emit = defineEmits<{
  close: []
}>()

const game = ref<LibraryGame | null>(null)
const open = ref(props.open)

// Watch for open prop changes
watch(
  () => props.open,
  (newValue) => {
    open.value = newValue
  },
)

const fetchGame = async (): Promise<void> => {
  if (props.gameId) {
    game.value = await libraryService.getById(props.gameId)
  }
}

onMounted(async () => {
  await fetchGame()
})

const closeModal = (): void => {
  open.value = false
  emit('close')
}

// Player count visualization helpers
const getPlayerCountRange = (): number[] => {
  if (!game.value?.game) return []
  const min = game.value.game.min_players
  const max = game.value.game.max_players
  return Array.from({ length: max - min + 1 }, (_, i) => min + i)
}

const getPlayerCountClass = (count: number): string => {
  if (!game.value?.game) return 'bg-gray-200'

  const bestAt = parseBestAt(game.value.game.best_at)
  const recommendedAt = parseRecommendedAt(game.value.game.recommended_at)

  if (bestAt.includes(count)) {
    return 'bg-green-500'
  } else if (recommendedAt.includes(count)) {
    return 'bg-blue-300'
  } else {
    return 'bg-gray-200'
  }
}

const getPlayerCountTooltip = (count: number): string => {
  if (!game.value?.game) return `${count} players`

  const bestAt = parseBestAt(game.value.game.best_at)
  const recommendedAt = parseRecommendedAt(game.value.game.recommended_at)

  if (bestAt.includes(count)) {
    return `${count} players - Best`
  } else if (recommendedAt.includes(count)) {
    return `${count} players - Recommended`
  } else {
    return `${count} players - Playable`
  }
}

// Parse best_at (usually single values like "3" or comma-separated like "3,5")
const parseBestAt = (bestAt?: string): number[] => {
  if (!bestAt) return []
  return bestAt.split(',').map((n) => parseInt(n.trim()))
}

// Parse recommended_at (usually ranges like "3-4" or comma-separated ranges like "2,4-6")
const parseRecommendedAt = (recommendedAt?: string): number[] => {
  if (!recommendedAt) return []

  const result: number[] = []

  // Handle the most common case: simple range like "3-4" or "3–4" (em dash)
  const hasHyphen = recommendedAt.includes('-')
  const hasEmDash = recommendedAt.includes('–')

  if ((hasHyphen || hasEmDash) && !recommendedAt.includes(',')) {
    const separator = hasEmDash ? '–' : '-'
    const [startStr, endStr] = recommendedAt.split(separator)
    if (!startStr || !endStr) return []
    const start = parseInt(startStr.trim())
    const end = parseInt(endStr.trim())

    if (!isNaN(start) && !isNaN(end) && start <= end) {
      for (let i = start; i <= end; i++) {
        result.push(i)
      }
    }
    return result
  }

  // Handle comma-separated values and ranges
  const parts = recommendedAt.split(',')

  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.includes('-') || trimmed.includes('–')) {
      // Handle range like "3-4" or "3–4"
      const separator = trimmed.includes('–') ? '–' : '-'
      const [startStr, endStr] = trimmed.split(separator)
      if (!startStr || !endStr) return []
      const start = parseInt(startStr.trim())
      const end = parseInt(endStr.trim())

      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          result.push(i)
        }
      }
    } else {
      // Handle single number like "2"
      const num = parseInt(trimmed)
      if (!isNaN(num)) {
        result.push(num)
      }
    }
  }

  return result
}
</script>
