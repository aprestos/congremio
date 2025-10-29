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
          class="sm:col-span-3"
        />

        <CInput
          id="end-date"
          v-model="formData.endDate"
          label="End Date"
          type="date"
          name="end-date"
          class="sm:col-span-3"
        />

        <CInput
          id="edition-name"
          v-model="formData.name"
          label="Edition Name"
          type="text"
          name="edition-name"
          class="sm:col-span-6"
        />

        <CInput
          id="location-title"
          v-model="formData.locationTitle"
          label="Location"
          type="text"
          name="location-title"
          class="sm:col-span-6"
        />

        <CInput
          id="location-url"
          v-model="formData.locationUrl"
          label="Location URL"
          type="text"
          name="location-url"
          class="sm:col-span-6"
        />

        <CTextArea
          id="description"
          v-model="formData.description"
          label="Short Description"
          name="description"
          :rows="3"
          class="sm:col-span-6"
        />

        <CTextArea
          id="long-description"
          v-model="formData.longDescription"
          label="Long Description"
          name="long-description"
          :rows="6"
          class="sm:col-span-6"
        />

        <!-- Poster Upload -->
        <div class="sm:col-span-6">
          <label
            class="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Poster
          </label>
          <div class="flex items-center gap-x-8">
            <img
              v-if="posterPreview"
              :src="posterPreview"
              alt="Edition poster"
              class="h-32 w-24 flex-none rounded-lg bg-gray-100 object-cover outline -outline-offset-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10"
            />
            <div
              v-else
              class="h-32 w-24 flex-none rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center outline -outline-offset-1 outline-black/5 dark:outline-white/10"
            >
              <span class="text-gray-400 dark:text-gray-600 text-sm"
                >No poster</span
              >
            </div>
            <div>
              <CButton
                variant="secondary"
                @click="showPosterUploadDialog = true"
              >
                Change poster
              </CButton>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                JPG, PNG, GIF or WebP. Recommended size: 800x600px. Max file
                size: 10MB.
              </p>
              <FilePondUploadDialog
                :open="showPosterUploadDialog"
                title="Upload Poster"
                description="Select a poster image for your edition (max 10MB)"
                :allow-multiple="false"
                :accepted-file-types="[
                  'image/jpeg',
                  'image/png',
                  'image/gif',
                  'image/webp',
                ]"
                max-file-size="10MB"
                :max-files="1"
                supabase-bucket="images"
                :supabase-path="posterFolder"
                file-naming-strategy="uuid"
                :supabase-options="{
                  cacheControl: '31536000',
                  upsert: false,
                }"
                @close="showPosterUploadDialog = false"
                @upload-success="handlePosterUploadSuccess"
                @upload-error="handlePosterUploadError"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Configuration -->
      <div class="mt-10 hidden">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          Schedule Configuration
        </h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Define the operating hours for your convention
        </p>

        <div class="mt-6">
          <div class="flex items-center gap-3">
            <input
              id="specific-schedule"
              v-model="formData.useSpecificSchedule"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label
              for="specific-schedule"
              class="text-sm font-medium text-gray-900 dark:text-white"
            >
              Use specific schedule for each day
            </label>
          </div>
        </div>

        <!-- General Schedule (when not using specific schedule) -->
        <div v-if="!formData.useSpecificSchedule" class="mt-6">
          <div
            class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6"
          >
            <CInput
              id="general-opening"
              v-model="formData.generalSchedule.opening"
              label="Opening Time"
              type="time"
              name="general-opening"
              class="sm:col-span-3"
            />

            <CInput
              id="general-closing"
              v-model="formData.generalSchedule.closing"
              label="Closing Time"
              type="time"
              name="general-closing"
              class="sm:col-span-3"
            />
          </div>
        </div>

        <!-- Specific Daily Schedule -->
        <div v-else class="mt-6 space-y-4">
          <div
            v-for="(day, index) in dailySchedules"
            :key="index"
            class="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ day.label }}
              </h4>
              <div class="flex items-center gap-2">
                <input
                  :id="`day-${index}-enabled`"
                  v-model="day.enabled"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  :for="`day-${index}-enabled`"
                  class="text-sm text-gray-600 dark:text-gray-400"
                >
                  Open
                </label>
              </div>
            </div>

            <div v-if="day.enabled" class="grid grid-cols-2 gap-4">
              <CInput
                :id="`day-${index}-opening`"
                v-model="day.opening"
                label="Opening Time"
                type="time"
                :name="`day-${index}-opening`"
              />

              <CInput
                :id="`day-${index}-closing`"
                v-model="day.closing"
                label="Closing Time"
                type="time"
                :name="`day-${index}-closing`"
              />
            </div>
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
import { ref, watch, onMounted, computed } from 'vue'
import { toast } from 'vue-sonner'
import CButton from '@/components/CButton.vue'
import CInput from '@/components/CInput.vue'
import CTextArea from '@/components/CTextArea.vue'
import SettingsSection from '@/components/SettingsSection.vue'
import FilePondUploadDialog from '@/components/FilePondUploadDialog.vue'
import { editionService } from '@/features/events/service.ts'
import { tenantStore } from '@/stores/tenant.ts'
import { editionStore } from '@/stores/edition.ts'
import logger from '@/lib/logger.ts'

interface DailySchedule {
  date: string
  label: string
  enabled: boolean
  opening: string
  closing: string
}

// Form data
const formData = ref({
  startDate: '',
  endDate: '',
  name: '',
  locationTitle: '',
  locationUrl: '',
  description: '',
  longDescription: '',
  poster: '',
  useSpecificSchedule: false,
  generalSchedule: {
    opening: '09:00',
    closing: '22:00',
  },
})

// Generate daily schedules based on date range
const dailySchedules = ref<DailySchedule[]>([])
const posterPreview = ref<string | null>(null)
const showPosterUploadDialog = ref(false)

// Computed folder path for poster uploads
const posterFolder = computed((): string => {
  const tenantId = tenantStore.value?.id
  return tenantId ? `tenants/${tenantId}/posters` : 'tenants/default/posters'
})

// Handle poster upload success
const handlePosterUploadSuccess = (urls: string[]): void => {
  showPosterUploadDialog.value = false
  const url = urls[0]
  if (url) {
    posterPreview.value = url
    formData.value.poster = url
    logger.debug('Poster uploaded successfully:', { url })
    toast.success('Poster uploaded successfully!')
  }
}

// Handle poster upload error
const handlePosterUploadError = (error: any): void => {
  console.error('Poster upload failed:', error)
  toast.error('Failed to upload poster. Please try again.')
}

// Load initial data from eventStore
onMounted(() => {
  if (editionStore.value) {
    // Format dates to YYYY-MM-DD for input type="date"
    if (editionStore.value.start_date) {
      formData.value.startDate =
        editionStore.value.start_date.split('T')[0] ?? ''
    }
    if (editionStore.value.end_date) {
      formData.value.endDate = editionStore.value.end_date.split('T')[0] ?? ''
    }
    if (editionStore.value.name) {
      formData.value.name = editionStore.value.name
    }
    if (editionStore.value.location?.title) {
      formData.value.locationTitle = editionStore.value.location.title
    }
    if (editionStore.value.location?.url) {
      formData.value.locationUrl = editionStore.value.location.url
    }
    if (editionStore.value.description) {
      formData.value.description = editionStore.value.description
    }
    if (editionStore.value.poster_url) {
      formData.value.poster = editionStore.value.poster_url
      posterPreview.value = editionStore.value.poster_url
    }
  }
})

// Watch for date changes to regenerate daily schedules
watch(
  () => [formData.value.startDate, formData.value.endDate],
  ([startDate, endDate]) => {
    if (startDate && endDate) {
      generateDailySchedules(startDate, endDate)
    }
  },
  { immediate: true },
)

// Generate daily schedules for date range
const generateDailySchedules = (startDate: string, endDate: string): void => {
  const schedules: DailySchedule[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  const currentDate = new Date(start)
  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0] ?? ''
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' })
    const dateLabel = currentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })

    schedules.push({
      date: dateStr,
      label: `${dayName}, ${dateLabel}`,
      enabled: true,
      opening: formData.value.generalSchedule.opening,
      closing: formData.value.generalSchedule.closing,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  dailySchedules.value = schedules
}

// Loading state for save operation
const isSaving = ref(false)

// Save edition function
const saveEdition = async (): Promise<void> => {
  try {
    isSaving.value = true

    const editionData = {
      ...formData.value,
      dailySchedules: formData.value.useSpecificSchedule
        ? dailySchedules.value
        : null,
    }

    await editionService.save(tenantStore.value?.id, editionStore.value?.id, {
      ...(editionData.startDate && { start_date: editionData.startDate }),
      ...(editionData.endDate && { end_date: editionData.endDate }),
      ...(editionData.name && { name: editionData.name }),
      ...(editionData.description && { description: editionData.description }),
      ...(editionData.longDescription && {
        long_description: editionData.longDescription,
      }),
      ...(editionData.poster && { poster_url: editionData.poster }),
      location: {
        title: editionData.locationTitle,
        url: editionData.locationUrl,
      },
    })

    // Update eventStore with new values
    if (editionStore.value) {
      editionStore.value = {
        ...editionStore.value,
        ...(editionData.startDate && { start_date: editionData.startDate }),
        ...(editionData.endDate && { end_date: editionData.endDate }),
        ...(editionData.name && { name: editionData.name }),
        ...(editionData.description && {
          description: editionData.description,
        }),
        ...(editionData.longDescription && {
          long_description: editionData.longDescription,
        }),
        ...(editionData.poster && { poster: editionData.poster }),
        location: {
          title: editionData.locationTitle,
          url: editionData.locationUrl,
        },
      }
    }

    logger.debug('Edition settings saved successfully:', { editionData })
    toast.success('Edition settings saved successfully!')
  } catch (error) {
    logger.error('Error saving edition settings:', { error })
    toast.error('Failed to save edition settings. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Handle form submit
const handleSubmit = async (event: Event): Promise<void> => {
  event.preventDefault()

  if (isSaving.value) return

  await saveEdition()
}
</script>
