<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { editionStore } from '@/stores/edition.ts'
import { settingsStore } from '@/features/settings/useSettings.store.ts'
import {
  IconCalendar,
  IconMapPin,
  IconClock,
  IconBooks,
  IconTrophy,
  IconDeviceGamepad2,
  IconUsers,
  IconClockHour4,
  IconCalendarEvent,
} from '@tabler/icons-vue'
import { RouterLink } from 'vue-router'
import { RouteNames } from '@/router/routeNames.ts'
import { tenantStore } from '@/stores/tenant.ts'
import { useI18n } from 'vue-i18n'

// Set page-specific theme color
const edition = computed(() => editionStore.value)
const tenant = computed(() => tenantStore.value)
const settings = computed(() => settingsStore.value)

const imagesToShow = ref<string[]>([])

onMounted(() => {
  const images = [
    'https://images.unsplash.com/photo-1632501641765-e568d28b0015?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547638375-ebf04735d792?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1719494206741-79831f9f4d51?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585504198199-20277593b94f?q=80&w=800&auto=format&fit=crop',
    ...(tenant.value?.images ?? []),
  ]

  imagesToShow.value = getRandomImages(images, 5)
})

// Generate random images without repetition using Fisher-Yates shuffle
const getRandomImages = (images: string[], count: number): string[] => {
  const itemsToShuffle = [...images]
  const shuffled: string[] = []

  for (let i = 0; i < Math.min(count, itemsToShuffle.length); i++) {
    const randomIndex = Math.floor(Math.random() * itemsToShuffle.length)
    const item = itemsToShuffle[randomIndex]
    if (item !== undefined) {
      shuffled.push(item)
      itemsToShuffle.splice(randomIndex, 1)
    }
  }

  return shuffled
}

// Format dates
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'TBA'
  const locale = useI18n().locale.value
  return new Date(dateString).toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
  })
}

const features = [
  {
    name: 'Game Library',
    description:
      'Access hundreds of board games from our extensive library. Browse, reserve, and play the latest and greatest titles.',
    icon: IconBooks,
    enabled: settings.value?.library?.enabled ?? false,
    route: RouteNames.public.library,
  },
  {
    name: 'Tournaments',
    description:
      'Compete in organized tournaments across various game categories. Win prizes and glory!',
    icon: IconTrophy,
    enabled: settings.value?.tournaments?.enabled ?? false,
    route: RouteNames.admin.tournaments,
  },
  {
    name: 'Flea Market',
    description:
      'Buy, sell, and trade board games with fellow enthusiasts. Find rare gems and expand your collection.',
    icon: IconDeviceGamepad2,
    enabled: settings.value?.flea?.enabled ?? false,
    route: RouteNames.public.fleaMarket,
  },
]

const stats = [
  {
    id: 1,
    name: 'Board Games Available',
    value: '500+',
    icon: IconBooks,
  },
  {
    id: 2,
    name: 'Expected Attendees',
    value: '400+',
    icon: IconUsers,
  },
  {
    id: 3,
    name: 'Gaming Hours',
    value: '48h',
    icon: IconClockHour4,
  },
  {
    id: 4,
    name: 'Events',
    value: '20+',
    icon: IconCalendarEvent,
  },
]

const sponsors: Array<Record<string, string>> = []
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero section -->
    <div class="relative isolate overflow-hidden">
      <svg
        class="absolute inset-0 -z-10 size-full stroke-gray-200 dark:stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            width="200"
            height="200"
            x="50%"
            y="-1"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          stroke-width="0"
          fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
        />
      </svg>
      <div
        class="absolute top-0 left-1/2 right-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
        aria-hidden="true"
      >
        <div
          class="aspect-801/1036 w-176.25 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style="
            clip-path: polygon(
              63.1% 29.5%,
              100% 17.1%,
              76.6% 3%,
              48.4% 0%,
              44.6% 4.7%,
              54.5% 25.3%,
              59.8% 49%,
              55.2% 57.8%,
              44.4% 57.2%,
              27.8% 47.9%,
              35.1% 81.5%,
              0% 97.7%,
              39.2% 100%,
              35.2% 81.4%,
              97.2% 52.8%,
              63.1% 29.5%
            );
          "
        />
      </div>
      <div class="overflow-hidden">
        <div
          class="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32"
        >
          <div
            class="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center"
          >
            <div class="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
              <h1
                class="text-pretty text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl"
              >
                {{ edition?.name || 'Board Game Convention' }}
              </h1>
              <p
                class="mt-8 text-pretty text-lg font-medium text-gray-500 dark:text-gray-400 sm:max-w-md sm:text-xl/8 lg:max-w-none"
              >
                {{
                  edition?.description ||
                  'Join us for an unforgettable board gaming experience!'
                }}
              </p>

              <!-- Event Details -->
              <div class="mt-10 flex flex-col gap-4">
                <div
                  class="flex items-center gap-3 text-base text-gray-600 dark:text-gray-300"
                >
                  <IconCalendar
                    class="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                  />
                  <span>
                    {{ formatDate(edition?.start_date) }} -
                    {{ formatDate(edition?.end_date) }}
                  </span>
                </div>
                <div
                  class="flex items-center gap-3 text-base text-gray-600 dark:text-gray-300"
                >
                  <a class="flex gap-3" :href="edition?.location?.url || '#'">
                    <IconMapPin
                      class="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                    />
                    <span>{{
                      edition?.location?.title || 'Location TBA'
                    }}</span>
                  </a>
                </div>
                <div
                  class="flex items-center gap-3 text-base text-gray-600 dark:text-gray-300"
                >
                  <IconClock
                    class="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                  />
                  <span>Schedule TBA</span>
                </div>
              </div>

              <div class="mt-10 flex items-center gap-x-6">
                <RouterLink
                  :to="{ name: RouteNames.public.library }"
                  class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Browse Game Library
                </RouterLink>
                <a
                  href="#features"
                  class="text-sm/6 font-semibold text-gray-900 dark:text-white"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div
              class="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0"
            >
              <div
                class="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80"
              >
                <div class="relative">
                  <img
                    :src="imagesToShow[0]"
                    alt="Modern board game components"
                    class="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg dark:bg-gray-100/5"
                  />
                  <div
                    class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset dark:ring-white/10"
                  />
                </div>
              </div>
              <div
                class="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36"
              >
                <div class="relative">
                  <img
                    :src="imagesToShow[1]"
                    alt="People playing modern board games"
                    class="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg dark:bg-gray-100/5"
                  />
                  <div
                    class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset dark:ring-white/10"
                  />
                </div>
                <div class="relative">
                  <img
                    :src="imagesToShow[2]"
                    alt="Board game collection shelf"
                    class="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg dark:bg-gray-100/5"
                  />
                  <div
                    class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset dark:ring-white/10"
                  />
                </div>
              </div>
              <div class="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                <div class="relative">
                  <img
                    :src="imagesToShow[3]"
                    alt="Board game tournament"
                    class="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg dark:bg-gray-100/5"
                  />
                  <div
                    class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset dark:ring-white/10"
                  />
                </div>
                <div class="relative">
                  <img
                    :src="imagesToShow[4]"
                    alt="Group enjoying board games"
                    class="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg dark:bg-gray-100/5"
                  />
                  <div
                    class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset dark:ring-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="mx-auto mt-8 max-w-7xl px-6 lg:px-8">
      <div
        class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4"
      >
        <div
          v-for="stat in stats"
          :key="stat.id"
          class="flex flex-col gap-y-3 border-l border-gray-900/10 dark:border-white/10 pl-6"
        >
          <dt
            class="flex items-center gap-x-2 text-sm/6 text-gray-600 dark:text-gray-400"
          >
            <component
              :is="stat.icon"
              class="h-5 w-5 text-indigo-600 dark:text-indigo-400"
              aria-hidden="true"
            />
            {{ stat.name }}
          </dt>
          <dd
            class="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white"
          >
            {{ stat.value }}
          </dd>
        </div>
      </div>
    </div>

    <!-- Edition Poster Section -->
    <div
      v-if="edition?.poster_url"
      class="mx-auto mt-16 max-w-7xl px-6 lg:px-8"
    >
      <div
        class="relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-8 shadow-lg"
      >
        <div
          class="aspect-[3/4] max-w-2xl mx-auto w-full overflow-hidden rounded-xl"
        >
          <img
            :src="edition?.poster_url"
            :alt="`${edition?.name} poster`"
            class="size-full object-cover object-center"
          />
        </div>
      </div>
    </div>

    <!-- Features section -->
    <div id="features" class="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
      <div class="mx-auto max-w-2xl lg:text-center">
        <h2
          class="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400"
        >
          Everything you need
        </h2>
        <p
          class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-balance"
        >
          Your ultimate board gaming experience
        </p>
        <p class="mt-6 text-lg/8 text-gray-600 dark:text-gray-400">
          From casual play to competitive tournaments, we have everything to
          make this convention unforgettable.
        </p>
      </div>
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl
          class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
        >
          <div
            v-for="feature in features"
            v-show="feature.enabled"
            :key="feature.name"
            class="flex flex-col"
          >
            <dt
              class="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900 dark:text-white"
            >
              <component
                :is="feature.icon"
                class="h-5 w-5 flex-none text-indigo-600 dark:text-indigo-400"
                aria-hidden="true"
              />
              {{ feature.name }}
            </dt>
            <dd
              class="mt-4 flex flex-auto flex-col text-base/7 text-gray-600 dark:text-gray-400"
            >
              <p class="flex-auto">{{ feature.description }}</p>
              <p class="mt-6">
                <RouterLink
                  :to="{ name: feature.route }"
                  class="text-sm/6 font-semibold text-indigo-600 dark:text-indigo-400"
                >
                  Learn more <span aria-hidden="true">→</span>
                </RouterLink>
              </p>
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Sponsors section -->
    <div class="hidden mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
      <h2
        class="text-center text-lg/8 font-semibold text-gray-900 dark:text-white"
      >
        Proudly supported by our amazing sponsors
      </h2>
      <div
        class="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-4"
      >
        <img
          v-for="sponsor in sponsors"
          :key="sponsor.name"
          class="col-span-2 max-h-12 w-full object-contain lg:col-span-1 dark:invert"
          :src="sponsor.logo"
          :alt="sponsor.name"
          width="158"
          height="48"
        />
      </div>
    </div>

    <!-- CTA section -->
    <div class="relative isolate mt-32 px-6 py-32 sm:mt-40 sm:py-40 lg:px-8">
      <svg
        class="absolute inset-0 -z-10 size-full stroke-gray-200 dark:stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="1d4240dd-898f-445f-932d-e2872fd12de3"
            width="200"
            height="200"
            x="50%"
            y="0"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg
          x="50%"
          y="0"
          class="overflow-visible fill-gray-50 dark:fill-gray-950"
        >
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            stroke-width="0"
          />
        </svg>
        <rect
          width="100%"
          height="100%"
          stroke-width="0"
          fill="url(#1d4240dd-898f-445f-932d-e2872fd12de3)"
        />
      </svg>
      <div
        class="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          class="aspect-1108/632 w-138.5 flex-none bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-20"
          style="
            clip-path: polygon(
              73.6% 51.7%,
              91.7% 11.8%,
              100% 46.4%,
              97.4% 82.2%,
              92.5% 84.9%,
              75.7% 64%,
              55.3% 47.5%,
              46.5% 49.4%,
              45% 62.9%,
              50.3% 87.2%,
              21.3% 64.1%,
              0.1% 100%,
              5.4% 51.1%,
              21.4% 63.9%,
              58.9% 0.2%,
              73.6% 51.7%
            );
          "
        />
      </div>
      <div class="mx-auto max-w-2xl text-center">
        <h2
          class="text-balance text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
        >
          Ready to join the fun?
        </h2>
        <p
          class="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray-600 dark:text-gray-400"
        >
          Create your free account to reserve games, join tournaments, and
          unlock all convention features!
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <RouterLink
            :to="{ name: RouteNames.auth.signIn }"
            class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign up for free!
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
