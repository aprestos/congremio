<template>
  <div class="col-span-full">
    <label
      :for="id"
      class="block text-sm/6 font-medium text-gray-900 dark:text-white"
    >
      {{ label }}
    </label>
    <div class="mt-2">
      <VueSelect
        :id="id"
        :model-value="modelValue"
        :is-searchable="true"
        :options="internalOptions"
        :placeholder="placeholder"
        :is-loading="isLoading"
        :classes="{
          container: 'w-full',
          control: [
            '!w-full !rounded-md !bg-white dark:!bg-gray-700 !outline-1 !-outline-offset-1 !border-0 focus:!border-0 focus-within:!outline-2 focus-within:!-outline-offset-2',
            errors && errors.length > 0
              ? '!outline-red-300 dark:!outline-red-500 focus:!outline-red-600 focus-within:!outline-red-600'
              : '!outline-gray-300 dark:!outline-gray-600 focus:!outline-indigo-600 dark:focus:!outline-indigo-400 focus-within:!outline-indigo-600 dark:focus-within:!outline-indigo-400',
          ].join(' '),
          valueContainer: '!px-3 !py-1.5',
          placeholder:
            '!text-base !text-gray-400 dark:!text-gray-300 sm:!text-sm/6',
          singleValue:
            '!text-base !text-gray-900 dark:!text-white sm:!text-sm/6',
          multiValue: 'bg-blue-100 dark:bg-blue-900 rounded-md',
          multiValueLabel: 'text-blue-800 dark:text-blue-200 px-2 py-1',
          multiValueRemove: 'hover:bg-blue-200 dark:hover:bg-blue-800 px-2',
          inputContainer: '',
          searchInput:
            '!text-base !text-gray-900 dark:!text-white placeholder:!text-gray-400 dark:placeholder:!text-gray-300 sm:!text-sm/6',
          menuContainer:
            'mt-1 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg bg-white dark:bg-gray-700 z-[200]',
          menuOption:
            'px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
          //menuOptionFocused: 'bg-indigo-600 dark:bg-indigo-500 text-white',
          noResults: 'text-gray-500 dark:text-gray-400 p-3',
          taggableNoOptions:
            'text-indigo-600 dark:text-indigo-400 p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900',
          //loadingSpinner: 'text-indigo-600 dark:text-indigo-400',
        }"
        @update:model-value="onUpdate"
        @search="handleSearch"
      >
        <template #option="{ option }">
          <div class="flex flex-col">
            <span class="font-medium">{{ option.label }}</span>
            <small v-if="option.secondaryLabel" class="text-gray-500">{{
              option.secondaryLabel
            }}</small>
          </div>
        </template>
      </VueSelect>
      <p v-if="helperText" class="text-xs mt-1 text-muted-color">
        {{ helperText }}
      </p>
    </div>
    <ValidationErrors v-if="errors" :errors="errors" />
  </div>
</template>

<script setup lang="ts" generic="T = unknown">
import { useDebounceFn } from '@vueuse/core'
import { defineEmits, defineProps, ref, watchEffect } from 'vue'
import VueSelect, { type Option } from 'vue3-select-component'
import ValidationErrors from '@/components/ValidationErrors.vue'

const props = defineProps<{
  id: string
  label: string
  modelValue?: string | number | object | unknown[] | null
  placeholder?: string
  optionValue?: string
  optionLabel?: string
  optionSecondaryLabel?: string
  onSearch?: (query: string) => Promise<Array<T>>
  options?: Array<{ value: string | number; label: string }>
  errors?: string[]
  helperText?: string
}>()

const isLoading = ref<boolean>(false)
const internalOptions = ref<Option<string>[]>([])

// Set defaults
const { placeholder = 'Select an option' } = props

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

function onUpdate(value: unknown): void {
  emit('update:modelValue', value)
}

// Initialize and watch options from props
watchEffect(() => {
  if (props.options && props.options.length > 0) {
    internalOptions.value = props.options.map((item) => ({
      value: item.value,
      label: item.label,
    })) as Option<string>[]
  }
})

const handleSearch = useDebounceFn(async (value: string) => {
  if (!props.onSearch) return

  isLoading.value = true
  try {
    if (value?.length > 1) {
      const result = await props.onSearch(value)
      internalOptions.value = result.map((item) => {
        // Type assertion to access properties safely
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const typedItem = item as Record<string, any>
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value: typedItem[props.optionValue || 'value'],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          label: typedItem[props.optionLabel || 'label'],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          secondaryLabel: typedItem[props.optionSecondaryLabel || 'label'],
        } as unknown as Option<string>
      })
    }
  } finally {
    isLoading.value = false
  }
}, 300)
</script>
