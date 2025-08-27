<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div class="p-3">
                <input
                  placeholder="Search..."
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autocomplete="postal-code"
                  v-model="query"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <ul role="list" class="divide-y divide-gray-100">
                <li
                  v-for="game in results"
                  :key="game.id"
                  class="relative flex justify-between gap-x-6 py-2 hover:bg-gray-50"
                >
                  <div class="flex min-w-0 gap-x-4">
                    <div class="px-3 min-w-0 flex-auto">
                      <p class="text-sm/6 font-semibold text-gray-900">
                        <a href="#" @click.prevent="onSelectedGame(game)">
                          <span class="absolute inset-x-0 -top-px bottom-0" />
                          {{ game.name }}
                        </a>
                      </p>
                      <p class="mt-1 flex text-xs/5 text-gray-500">
                        <a class="relative truncate hover:underline">{{
                          game.yearPublished
                        }}</a>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useDebounceFn } from "@vueuse/core";
import { ref, watch } from "vue";
import type { Game } from "@/features/external-game/model.ts";
import gameService from "@/features/external-game/service.ts";

const open = ref(true);
const query = ref("");
const results = ref<Game[]>([]);

const emit = defineEmits(["selected-game"]);

const search = useDebounceFn(async (value) => {
  if (value?.length > 1) {
    const response = await gameService.search(value);
    console.log(response);
    results.value = response;
  }
}, 500);

const onSelectedGame = async (event: { id: string }) => {
  const game = await gameService.get(event.id);
  console.log(game);
  emit("selected-game", game);
};

watch(query, async (newValue) => {
  console.log(newValue);
  await search(newValue);
});
</script>
