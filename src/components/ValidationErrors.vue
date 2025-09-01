<template>
  <div v-if="errors && errors.length > 0" class="mt-2 text-sm text-red-600">
    <p v-for="(error, index) in errors" :key="index">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  errors?: string[] | undefined
}

defineProps<Props>()
</script>
