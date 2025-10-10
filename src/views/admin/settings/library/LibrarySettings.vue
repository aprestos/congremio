<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import SettingsSection from '@/components/SettingsSection.vue'
import CButton from '@/components/CButton.vue'
import CInput from '@/components/CInput.vue'
import { IconPlus, IconTrash, IconMapPin } from '@tabler/icons-vue'
import type { LibraryLocation } from '@/features/library/locations/location.model.ts'
import { libraryLocationService } from '@/features/library/locations/service.ts'

const locations = ref<LibraryLocation[]>([])
const isLoading = ref(false)
const newLocationName = ref('')
const isAddingLocation = ref(false)

// Load locations on mount
onMounted(async () => {
  await loadLocations()
})

const loadLocations = async (): Promise<void> => {
  try {
    isLoading.value = true
    const data = await libraryLocationService.get()
    locations.value = data
  } catch (error) {
    console.error('Error loading locations:', error)
    toast.error('Failed to load locations')
  } finally {
    isLoading.value = false
  }
}

const addLocation = async (): Promise<void> => {
  if (!newLocationName.value.trim()) {
    toast.error('Please enter a location name')
    return
  }

  try {
    isAddingLocation.value = true
    await libraryLocationService.create(newLocationName.value.trim())
    toast.success('Location added successfully')
    newLocationName.value = ''
    await loadLocations()
  } catch (error) {
    console.error('Error adding location:', error)
    toast.error('Failed to add location')
  } finally {
    isAddingLocation.value = false
  }
}

const deleteLocation = async (id: number): Promise<void> => {
  if (!confirm('Are you sure you want to delete this location?')) {
    return
  }

  try {
    console.log(id)
    //await libraryLocationService.delete(id)
    toast.success('Location deleted successfully')
    await loadLocations()
  } catch (error) {
    console.error('Error deleting location:', error)
    toast.error('Failed to delete location')
  }
}
</script>

<template>
  <SettingsSection
    title="Library Locations"
    description="Manage the physical locations where games are stored in your library"
  >
    <!-- Add New Location Form -->
    <div class="mb-6">
      <label
        for="new-location"
        class="block text-sm font-medium text-gray-900 dark:text-white mb-2"
      >
        Add New Location
      </label>
      <div class="flex gap-3">
        <div class="flex-1">
          <CInput
            id="new-location"
            v-model="newLocationName"
            label=""
            type="text"
            name="new-location"
            placeholder="e.g., Shelf A1, Table 3, Storage Room..."
            @keyup.enter="addLocation"
          />
        </div>
        <CButton type="button" :loading="isAddingLocation" @click="addLocation">
          <IconPlus class="h-5 w-5 mr-2 -ml-1" />
          Add Location
        </CButton>
      </div>
    </div>

    <!-- Locations List -->
    <div class="mt-6">
      <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
        Current Locations
      </h3>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="locations?.length === 0"
        class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
      >
        <IconMapPin
          class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
        />
        <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
          No locations
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new location.
        </p>
      </div>

      <!-- Locations Grid -->
      <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="location in locations"
          :key="location.id"
          class="relative flex items-center justify-between gap-x-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div class="flex items-center gap-x-3 flex-1 min-w-0">
            <IconMapPin
              class="h-5 w-5 flex-shrink-0 text-indigo-600 dark:text-indigo-400"
            />
            <span
              class="text-sm font-medium text-gray-900 dark:text-white truncate"
            >
              {{ location.name }}
            </span>
          </div>
          <button
            type="button"
            class="flex-shrink-0 rounded-md p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors"
            @click="deleteLocation(location.id)"
          >
            <span class="sr-only">Delete {{ location.name }}</span>
            <IconTrash class="h-5 w-5" />
          </button>
        </li>
      </ul>
    </div>
  </SettingsSection>
</template>

<style scoped></style>
