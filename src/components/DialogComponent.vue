<template>
  <div>
    <TransitionRoot as="template" :show="props.open">
      <Dialog class="relative z-[100]" @close="closeDialog">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 transition-opacity"
          />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div
            class="flex min-h-full justify-center text-center items-center sm:p-0 p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-none sm:rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full h-full sm:h-auto sm:my-8 sm:max-w-lg"
              >
                <div
                  class="border-b border-gray-200 px-4 py-5 sm:px-6 dark:border-white/10"
                >
                  <div
                    class="-mt-4 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap"
                  >
                    <div class="mt-4 ml-4">
                      <div class="flex items-center">
                        <div class="shrink-0">
                          <BuildingLibraryIcon class="size-10 text-gray-500" />
                        </div>
                        <div class="ml-4">
                          <h3
                            class="text-base font-semibold text-gray-900 dark:text-white"
                          >
                            {{ title }}
                          </h3>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            <a href="#">Library</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Close button -->
                <div class="absolute right-4 top-4 sm:right-6 sm:top-6">
                  <button
                    type="button"
                    class="p-1 rounded-2xl bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    @click="closeDialog"
                  >
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div class="px-4 pt-5 pb-4 sm:p-6">
                  <slot />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script lang="ts" setup>
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { BuildingLibraryIcon, XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  open: boolean
  title?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const closeDialog = () => {
  emit('close')
}
</script>
