<template>
  <SettingsSection
    title="Current edition information"
    description="Manage the current edition dates and configuration"
  >
    <form @submit="handleSubmit">
      <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <CInput
          id="start-date"
          v-model="formData.startDate"
          label="Start Date"
          type="date"
          name="start-date"
        />

        <CInput
          id="end-date"
          v-model="formData.endDate"
          label="End Date"
          type="date"
          name="end-date"
        />

        <CInput
          id="edition-name"
          v-model="formData.name"
          label="Edition Name"
          type="text"
          name="edition-name"
        />
      </div>

      <div class="mt-8 flex">
        <CButton type="submit" :loading="isSaving" loading-text="Saving...">
          Save
        </CButton>
      </div>
    </form>
  </SettingsSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import CButton from '@/components/CButton.vue'
import CInput from '@/components/CInput.vue'
import SettingsSection from '@/components/SettingsSection.vue'

// Form data
const formData = ref({
  startDate: '',
  endDate: '',
  name: '',
})

// Loading state for save operation
const isSaving = ref(false)

// Save edition function
const saveEdition = (): void => {
  try {
    isSaving.value = true

    // TODO: Add your edition save logic here
    console.log('Edition settings saved successfully:', formData.value)
    toast.success('Edition settings saved successfully!')
  } catch (error) {
    console.error('Error saving edition settings:', error)
    toast.error('Failed to save edition settings. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Handle form submit
const handleSubmit = (event: Event): void => {
  event.preventDefault()

  if (isSaving.value) return

  saveEdition()
}
</script>
