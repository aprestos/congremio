<template>
  <form>
    <div class="space-y-12 mx-auto max-w-7xl">
      <div class="pb-12">
        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <CSelect
            id="external-game"
            v-model="formData.selectedGame"
            label="Game"
            placeholder="Type to search"
            :on-search="gameService.search"
            option-label="name"
            option-value="external_id"
            option-secondary-label="year"
            :errors="r$.$errors.selectedGame"
          />

          <CInput
            id="owner"
            v-model="formData.owner"
            label="Owner"
            :errors="r$.$errors.owner"
          />

          <CSelect
            id="location"
            v-model="formData.selectedLocation"
            label="Location"
            placeholder="Select a location"
            :options="locations"
            :errors="r$.$errors.selectedLocation"
            helper-text="Optional"
          />

          <CTextArea
            id="notes"
            v-model="formData.notes"
            label="Notes"
            :rows="4"
            :errors="r$.$errors.notes"
            helper-text="Optional"
          />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
      <CButton
        type="button"
        variant="secondary"
        size="lg"
        class="order-2 sm:order-1 w-full sm:w-auto"
        @click="emit('close')"
      >
        Cancel
      </CButton>
      <CButton
        type="button"
        variant="primary"
        size="lg"
        class="order-1 sm:order-2 w-full sm:w-auto"
        :loading="isSubmitting"
        loading-text="Submitting..."
        @click="submit"
      >
        Submit
      </CButton>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { useRegle } from '@regle/core'
import { required } from '@regle/rules'
import { onMounted, ref } from 'vue'
import type { Option } from 'vue3-select-component'
import CButton from '@/components/CButton.vue'
import CInput from '@/components/CInput.vue'
import CSelect from '@/components/CSelect.vue'
import CTextArea from '@/components/CTextArea.vue'
import type { Game } from '@/features/external-game/model.ts'
import gameService from '@/features/external-game/service.ts'
import { libraryService } from '@/features/library/service.ts'
import { libraryLocationService } from '@/features/library/locations/service.ts'

const formData = ref<{
  selectedGame: number | undefined
  owner: string
  selectedLocation: number | undefined
  notes: string
}>({
  selectedGame: undefined,
  owner: '',
  selectedLocation: undefined,
  notes: '',
})
const locations = ref<Option<number>[]>([])
const isSubmitting = ref<boolean>(false)

const emit = defineEmits<{
  'game-added': []
  close: []
}>()

const { r$ } = useRegle(formData, {
  selectedGame: { required },
  owner: { required },
})

const submit = async (): Promise<void> => {
  if (isSubmitting.value) return

  // Validate form before submitting
  const { valid, data } = await r$.$validate()

  if (!valid) {
    console.log('Form has validation errors')
    return
  }

  isSubmitting.value = true

  try {
    if (formData.value.selectedGame) {
      const game: Game = await gameService.get(
        formData.value.selectedGame.toString(),
      )

      await libraryService.post(
        game.id,
        data.selectedLocation as number,
        data.owner,
        data.notes,
      )

      // Emit event to notify parent that game was added successfully
      emit('game-added')
    }
  } finally {
    isSubmitting.value = false
  }
}

// Expose the submit function so parent components can call it
defineExpose({
  submit,
})

onMounted(async () => {
  const result = await libraryLocationService.get()

  locations.value = result.map((result) => {
    return {
      label: result.name,
      value: result.id,
    }
  })
})
</script>
