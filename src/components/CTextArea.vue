<template>
  <div class="col-span-full">
    <label
      :for="id"
      class="block text-sm/6 font-medium text-gray-900 dark:text-white"
    >
      {{ label }}
    </label>
    <div class="mt-2">
      <textarea
        :id="id"
        :name="name || id"
        :rows="rows"
        :placeholder="placeholder"
        :value="modelValue"
        @input="
          $emit(
            'update:modelValue',
            ($event.target as HTMLTextAreaElement).value,
          )
        "
        :class="[
          'block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
          errors && errors.length > 0
            ? 'outline-red-300 dark:outline-red-500 focus:outline-red-600 dark:focus:outline-red-600'
            : 'outline-gray-300 dark:outline-gray-600 focus:outline-indigo-600 dark:focus:outline-indigo-400',
        ]"
      />
    </div>
    <ValidationErrors v-if="errors" :errors="errors" />
  </div>
</template>

<script setup lang="ts">
import ValidationErrors from "@/components/ValidationErrors.vue";

interface Props {
  id: string;
  label: string;
  modelValue: string;
  rows?: number;
  placeholder?: string;
  name?: string;
  errors?: string[];
}

withDefaults(defineProps<Props>(), {
  rows: 4,
  placeholder: "",
  name: undefined,
  errors: undefined,
});

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
