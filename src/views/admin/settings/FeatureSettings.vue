<template>
  <SettingsSection
    title="Enabled features"
    description="Select the features you want to be shown in the platform"
  >
    <form @submit="handleSubmit">
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <div
            class="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2 dark:bg-white/5 dark:inset-ring-white/10 dark:outline-indigo-500 dark:has-checked:bg-indigo-500"
          >
            <span
              class="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5"
            />
            <input
              id="library-module"
              v-model="features.library"
              type="checkbox"
              name="library-module"
              class="absolute inset-0 appearance-none focus:outline-hidden"
              aria-labelledby="library-module-label"
              aria-describedby="library-module-description"
            />
          </div>

          <div class="text-sm">
            <label
              id="library-module-label"
              class="font-medium text-gray-900 dark:text-white"
              >Library</label
            >
            {{ ' ' }}
            <span
              id="library-module-description"
              class="text-gray-500 dark:text-gray-400"
              >Manage your book and game collection</span
            >
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div
            class="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2 dark:bg-white/5 dark:inset-ring-white/10 dark:outline-indigo-500 dark:has-checked:bg-indigo-500"
          >
            <span
              class="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5"
            />
            <input
              id="tournaments-module"
              v-model="features.tournaments"
              type="checkbox"
              name="tournaments-module"
              class="absolute inset-0 appearance-none focus:outline-hidden"
              aria-labelledby="tournaments-module-label"
              aria-describedby="tournaments-module-description"
            />
          </div>

          <div class="text-sm">
            <label
              id="tournaments-module-label"
              class="font-medium text-gray-900 dark:text-white"
              >Tournaments</label
            >
            {{ ' ' }}
            <span
              id="tournaments-module-description"
              class="text-gray-500 dark:text-gray-400"
              >Organize and track gaming competitions</span
            >
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div
            class="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2 dark:bg-white/5 dark:inset-ring-white/10 dark:outline-indigo-500 dark:has-checked:bg-indigo-500"
          >
            <span
              class="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5"
            />
            <input
              id="flea-market-module"
              v-model="features.flea"
              type="checkbox"
              name="flea-market-module"
              class="absolute inset-0 appearance-none focus:outline-hidden"
              aria-labelledby="flea-market-module-label"
              aria-describedby="flea-market-module-description"
            />
          </div>

          <div class="text-sm">
            <label
              id="flea-market-module-label"
              class="font-medium text-gray-900 dark:text-white"
              >Flea Market</label
            >
            {{ ' ' }}
            <span
              id="flea-market-module-description"
              class="text-gray-500 dark:text-gray-400"
              >Enable buying and selling of items</span
            >
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div
            class="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2 dark:bg-white/5 dark:inset-ring-white/10 dark:outline-indigo-500 dark:has-checked:bg-indigo-500"
          >
            <span
              class="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5"
            />
            <input
              id="events-module"
              v-model="features.events"
              type="checkbox"
              name="events-module"
              class="absolute inset-0 appearance-none focus:outline-hidden"
              aria-labelledby="events-module-label"
              aria-describedby="events-module-description"
            />
          </div>

          <div class="text-sm">
            <label
              id="events-module-label"
              class="font-medium text-gray-900 dark:text-white"
              >Events</label
            >
            {{ ' ' }}
            <span
              id="events-module-description"
              class="text-gray-500 dark:text-gray-400"
              >Schedule and manage event activities</span
            >
          </div>
        </div>
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
import SettingsSection from '@/components/SettingsSection.vue'
import {
  saveEnabledFeatures,
  settingsStore,
} from '@/features/settings/useSettings.store.ts'
import type { Setting } from '@/features/settings/setting.model.ts'

// Features state
const features = ref(
  JSON.parse(
    JSON.stringify(
      Object.entries(settingsStore.value || {}).reduce(
        (
          acc: Record<string, boolean>,
          [key, value]: [string, Setting<unknown>],
        ) => {
          acc[key] = value.enabled
          return acc
        },
        {},
      ),
    ),
  ),
)

// Loading state for save operation
const isSaving = ref(false)

// Save features function
const saveFeatures = async (): Promise<void> => {
  try {
    isSaving.value = true

    await saveEnabledFeatures(features.value)

    console.log('Feature settings saved successfully:', features.value)
    toast.success('Feature settings saved successfully!')
  } catch (error) {
    console.error('Error saving feature settings:', error)
    toast.error('Failed to save feature settings. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Handle form submit
const handleSubmit = async (event: Event): Promise<void> => {
  event.preventDefault()

  if (isSaving.value) return

  await saveFeatures()
}
</script>
