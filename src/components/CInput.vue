<template>
  <div class="col-span-full" :class="wrapperClass">
    <label
      v-if="label"
      :for="id"
      class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
    >
      {{ label }}
    </label>
    <div class="mt-2 relative">
      <!-- Left Icon Slot or Currency Symbol -->
      <div
        v-if="$slots['icon-left'] || (type === 'currency' && currency)"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <slot name="icon-left">
          <component
            :is="getCurrencyIcon(currency)"
            v-if="type === 'currency' && currency"
            class="size-4"
          />
        </slot>
      </div>
      <!-- Right Icon Slot -->
      <div
        v-if="$slots['icon-right']"
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <slot name="icon-right" />
      </div>
      <input
        :id="id"
        :name="name || id"
        :type="inputType"
        :placeholder="placeholder"
        :value="modelValue"
        :min="min"
        :class="[
          'block w-full rounded-md bg-white px-3 py-1.5 text-base dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500 text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
          $slots['icon-left'] || (type === 'currency' && currency)
            ? 'pl-10'
            : '',
          $slots['icon-right'] ? 'pr-10' : '',
          errors && errors.length > 0
            ? 'outline-red-300 focus:outline-red-600 dark:outline-red-400 dark:focus:outline-red-500'
            : 'outline-gray-300 focus:outline-indigo-600 dark:outline-white/10 dark:focus:outline-indigo-500',
        ]"
        @input="onInput"
        @blur="onBlur"
      />
    </div>
    <p v-if="helperText" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {{ helperText }}
    </p>
    <ValidationErrors v-if="errors" :errors="errors" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ValidationErrors from '@/components/ValidationErrors.vue'
import { editionStore } from '@/stores/edition.ts'
import { getCurrencyIcon } from '@/composables/useCurrency.ts'

interface Props {
  id: string
  label?: string
  modelValue: string
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'datetime-local'
    | 'time'
    | 'currency'
  placeholder?: string
  name?: string
  errors?: string[]
  wrapperClass?: string
  helperText?: string
  min?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  type: 'text',
  placeholder: '',
  name: undefined,
  errors: undefined,
  wrapperClass: '',
  helperText: undefined,
  min: undefined,
})

const currency = editionStore.value?.currency || ''

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [value: string]
}>()

// Map currency type to text for HTML input element
const inputType = computed(() => {
  return props.type === 'currency' ? 'text' : props.type
})

function onInput(e: Event): void {
  const value = (e.target as HTMLInputElement).value
  if (props.type === 'currency') {
    // Sanitize currency input on the fly
    const sanitized = value.replace(/[^0-9.,]/g, '').replace(/,/g, '.')
    const parts = sanitized.split('.')
    const cleaned =
      parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : sanitized
    emit('update:modelValue', cleaned)
  } else {
    emit('update:modelValue', value)
  }
}

function onBlur(e: Event): void {
  let value = (e.target as HTMLInputElement).value
  if (props.type === 'currency' && value) {
    // Format to 2 decimal places on blur
    const num = parseFloat(value.replace(/,/g, '.'))
    if (!Number.isNaN(num)) {
      value = num.toFixed(2)
      emit('update:modelValue', value)
    }
  }
  emit('blur', value)
}
</script>
