<template>
  <div class="">
    <form>
      <div class="space-y-12 mt-8 mx-auto max-w-7xl">
        <div class="pb-12">
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <CSelect
              id="external-game"
              label="Game"
              v-model="formData.selectedGame"
              placeholder="Type to search"
              :on-search="gameService.search"
              option-label="name"
              option-value="id"
              option-secondary-label="yearPublished"
              :errors="r$.$errors.selectedGame"
            />

            <CInput
              id="owner"
              label="Owner"
              v-model="formData.owner"
              :errors="r$.$errors.owner"
            />

            <CSelect
              id="location"
              label="Location"
              v-model="formData.selectedLocation"
              placeholder="Select a location"
              :options="locations"
              :errors="r$.$errors.selectedLocation"
            />

            <CTextArea
              id="notes"
              label="Notes"
              v-model="formData.notes"
              :rows="4"
              :errors="r$.$errors.notes"
            />
          </div>
        </div>
      </div>
      <div
        class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
      >
        <CButton
          type="button"
          variant="primary"
          @click="submit"
          :loading="isSubmitting"
          loading-text="Submitting..."
          class="sm:col-start-2"
        >
          Submit
        </CButton>
        <CButton
          type="button"
          variant="secondary"
          @click="emit('close')"
          class="mt-3 sm:col-start-1 sm:mt-0"
        >
          Cancel
        </CButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useRegle } from "@regle/core";
import { required } from "@regle/rules";
import { onMounted, reactive, ref } from "vue";
import type { Option } from "vue3-select-component";
import CButton from "@/components/CButton.vue";
import CInput from "@/components/CInput.vue";
import CSelect from "@/components/CSelect.vue";
import CTextArea from "@/components/CTextArea.vue";
import type { Game } from "@/features/external-game/model.ts";
import gameService from "@/features/external-game/service.ts";
import { libraryService } from "@/features/library/service.ts";
import { locationService } from "@/features/locations/service.ts";
import router from "@/router";

const formData = ref<{
  selectedGame: number | undefined;
  owner: string;
  selectedLocation: number | undefined;
  notes: string;
}>({
  selectedGame: undefined,
  owner: "",
  selectedLocation: undefined,
  notes: "",
});
const locations = ref<Option<number>[]>([]);
const isSubmitting = ref<boolean>(false);

const emit = defineEmits<{
  "game-added": [];
  close: [];
}>();

const { r$ } = useRegle(formData, {
  selectedGame: { required },
  owner: { required },
});

const submit = async () => {
  if (isSubmitting.value) return;

  // Validate form before submitting
  const { valid, data } = await r$.$validate();

  if (!valid) {
    console.log("Form has validation errors");
    return;
  }

  isSubmitting.value = true;

  try {
    if (formData.value.selectedGame) {
      const game: Game = await gameService.get(
        formData.value.selectedGame.toString(),
      );

      await libraryService.post(
        game.id,
        data.selectedLocation as number,
        data.owner,
        data.notes,
      );

      // Emit event to notify parent that game was added successfully
      emit("game-added");
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Expose the submit function so parent components can call it
defineExpose({
  submit,
});

onMounted(async () => {
  const result = await locationService.get();

  locations.value = result.map((result) => {
    return {
      label: result.name,
      value: result.id,
    };
  });
});
</script>
