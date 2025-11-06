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
            class="fixed inset-0 bg-black/70 dark:bg-gray-900/80 transition-opacity backdrop-blur-xs"
          />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div
            class="flex min-h-full justify-center text-center items-end sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                :class="[
                  'relative transform overflow-y-auto max-h-full w-full sm:h-auto sm:w-auto rounded-tl-2xl rounded-tr-2xl sm:rounded-lg bg-white dark:bg-gray-800 text-left shadow-2xl transition-all sm:my-8 sm:overflow-visible',
                  dialogSizeClasses,
                ]"
              >
                <div class="px-4 py-5 sm:px-6">
                  <div
                    class="-mt-4 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap"
                  >
                    <div class="mt-4 ml-4">
                      <div class="flex items-center">
                        <div class="">
                          <h3
                            class="text-xl font-semibold text-gray-900 dark:text-white"
                          >
                            {{ title }}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Close button -->
                <div class="absolute right-4 top-4 sm:right-6 sm:top-6">
                  <button
                    type="button"
                    class="p-1 cursor-pointer transition-all rounded-2xl text-gray-400 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    @click="closeDialog"
                  >
                    <span class="sr-only">Close</span>
                    <IconX class="h-6 w-6" aria-hidden="true" />
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
import { IconX } from '@tabler/icons-vue'
import { computed } from 'vue'

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

interface Props {
  open: boolean
  title?: string
  size?: DialogSize
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
})

const emit = defineEmits<{
  close: []
}>()

const closeDialog = (): void => {
  emit('close')
}

const dialogSizeClasses = computed((): string => {
  const sizeMap: Record<DialogSize, string> = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg md:min-w-[500px]',
    lg: 'sm:max-w-2xl md:min-w-[700px]',
    xl: 'sm:max-w-4xl md:min-w-[900px]',
    '2xl': 'sm:max-w-6xl md:min-w-[1100px]',
    full: 'sm:max-w-[90vw] md:min-w-[80vw]',
  }
  return sizeMap[props.size]
})
</script>
