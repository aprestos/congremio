<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { IconCheck } from '@tabler/icons-vue'

const { availableLocales, currentLocale, setLocale } = useLocale()

const handleLocaleChange = (localeCode: string): void => {
  setLocale(localeCode)
}
</script>

<template>
  <Listbox
    :model-value="currentLocale?.code"
    @update:model-value="handleLocaleChange"
  >
    <div class="relative w-40">
      <div
        class="relative w-full cursor-default overflow-hidden rounded-md bg-white dark:bg-white/5 text-left outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:focus-within:outline-indigo-500"
      >
        <ListboxButton
          class="relative flex flex-row items-center w-full cursor-default py-1.5 pl-3 pr-10 text-base sm:text-sm/6 text-gray-900 dark:text-white focus:ring-0 bg-transparent outline-none"
        >
          <img
            :alt="`image of ${currentLocale?.code} locale`"
            class="size-5 rounded-full mr-2"
            :src="`https://unpkg.com/language-icons/icons/${currentLocale?.code}.svg`"
          />
          <span class="block truncate">
            {{ currentLocale?.nativeName }}
          </span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronUpDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>
      </div>

      <TransitionRoot
        leave="transition ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <ListboxOptions
          class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-gray-200 dark:ring-white/10 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="locale in availableLocales"
            v-slot="{ active, selected }"
            :key="locale.code"
            :value="locale.code"
            as="template"
          >
            <li
              class="group relative cursor-default select-none py-2 pl-10 pr-10"
              :class="
                active
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                  : 'text-gray-900 dark:text-gray-100'
              "
            >
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <img
                  :alt="`${locale.nativeName} flag`"
                  class="size-5 rounded-full"
                  :src="`https://unpkg.com/language-icons/icons/${locale.code}.svg`"
                />
              </span>
              <span
                class="block truncate"
                :class="selected ? 'font-medium' : 'font-normal'"
              >
                {{ locale.nativeName }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 right-0 flex items-center pr-3"
                :class="
                  active ? 'text-white' : 'text-indigo-600 dark:text-indigo-500'
                "
              >
                <IconCheck class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </TransitionRoot>
    </div>
  </Listbox>
</template>
