<template>
  <DialogComponent
    :open="open"
    :title="t('admin.library.withdrawGame')"
    @close="emit('close')"
  >
    <div class="space-y-8">
      <!-- Game Card -->
      <div class="">
        <div class="flex items-center space-x-4">
          <div class="shrink-0">
            <img
              class="size-16 rounded-lg object-cover shadow-sm"
              :src="game?.game.image || '/placeholder-game.jpg'"
              :alt="game?.game.name || t('admin.library.unknownGame')"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white truncate"
            >
              {{ game?.game.name || t('admin.library.unknownGame') }}
            </h3>
            <div
              class="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
            >
              <span class="flex items-center">
                <svg
                  class="size-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {{ game?.game.year || t('admin.library.unknown') }}
              </span>
              <span v-if="game?.location?.name" class="flex items-center">
                <svg
                  class="size-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {{ game?.location?.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- Withdraw Form -->
      <form class="space-y-6" @submit.prevent="submit">
        <div class="w-full max-w-md py-4">
          <TabGroup :selected-index="selectedTab" @change="changeTab">
            <TabList
              class="flex space-x-1 rounded-xl bg-indigo-50 dark:bg-gray-900 p-1"
            >
              <Tab
                v-for="(tab, idx) in ['Search user', 'Create user']"
                :key="idx"
                v-slot="{ selected }"
                as="template"
              >
                <button
                  :class="[
                    'flex flex-row justify-center w-full cursor-pointer rounded-lg py-2.5 text-sm font-medium leading-5',
                    'bg-indigo-50 dark:bg-gray-900 ring-offset-2 ring-offset-indigo-50 dark:ring-offset-white/40',
                    selected
                      ? 'bg-indigo-600 dark:bg-indigo-700 text-white shadow'
                      : 'text-gray-500 hover:bg-white hover:dark:bg-gray-800 ',
                  ]"
                >
                  <IconUserPlus v-if="idx === 1" class="mr-2 size-5" />
                  <IconSearch v-if="idx === 0" class="mr-2 size-5" />
                  {{ tab }}
                </button>
              </Tab>
            </TabList>

            <TabPanels class="mt-2">
              <TabPanel :class="[' px-1 py-3', '']">
                <div class="">
                  <CSelect2
                    id="user"
                    v-model="formData.selectedUser"
                    :label="t('admin.library.withdrawTo')"
                    :placeholder="t('admin.library.searchAndSelectUser')"
                    :search-fn="
                      async (query) => {
                        const results = await userService.search(query)
                        return results.map((item) => ({
                          value: item.id,
                          label: item.name,
                          secondaryLabel: item.email
                            ? `(${item.email})`
                            : undefined,
                        })) as Array<Option<string>>
                      }
                    "
                    :errors="r$.$errors.selectedUser"
                  />
                </div>
              </TabPanel>
              <TabPanel
                :class="[
                  'px-1 py-3',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                ]"
              >
                <!-- Create User Form -->
                <div class="space-y-4">
                  <div class="">
                    <CInput
                      id="new-user-name"
                      v-model="newUser.name"
                      :label="t('auth.displayName')"
                      type="text"
                      :placeholder="t('auth.enterDisplayName')"
                      :errors="newUserR$.$errors.name"
                    />
                  </div>
                  <div class="space-y-4">
                    <CInput
                      id="new-user-email"
                      v-model="newUser.email"
                      :label="t('auth.email')"
                      type="email"
                      :placeholder="t('auth.enterEmailPlaceholder')"
                      :errors="newUserR$.$errors.email"
                    />
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
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
            {{ t('common.cancel') }}
          </CButton>
          <CButton
            type="submit"
            variant="yellow"
            size="lg"
            class="order-1 sm:order-2 w-full sm:w-auto"
            :loading="isSubmitting"
            :loading-text="t('admin.library.withdrawing')"
          >
            <svg
              class="size-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {{ t('admin.library.withdrawGame') }}
          </CButton>
        </div>
      </form>
    </div>
  </DialogComponent>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core'
import { required, email, minLength } from '@regle/rules'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import 'vue-sonner/style.css'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

import DialogComponent from '@/components/DialogComponent.vue'
import CButton from '@/components/CButton.vue'
import CInput from '@/components/CInput.vue'
import type { LibraryGame } from '@/features/library/game.model.ts'
import libraryWithdrawService from '@/features/library/withdraws/service.ts'
import { userService } from '@/features/users/service.ts'
import logger from '@/lib/logger.ts'
import type { Option } from 'vue3-select-component'
import CSelect2 from '@/CSelect2.vue'
import { IconSearch, IconUserPlus } from '@tabler/icons-vue'

const { t } = useI18n()

interface Props {
  open: boolean
  game: LibraryGame | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const formData = ref({ selectedUser: undefined as string | undefined })

const isSubmitting = ref(false)

const newUser = ref({
  email: '',
  name: '',
})

const selectedTab = ref<number>(0)
const changeTab = (index: number): void => {
  selectedTab.value = index
}
// Main form validation
const { r$ } = useRegle(formData, {
  selectedUser: { required },
})

// New user form validation
const { r$: newUserR$ } = useRegle(newUser, {
  email: { required, email },
  name: { required, minLength: minLength(2) },
})

const submit = async (): Promise<void> => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  if (selectedTab.value === 1) {
    await createUser()
  }

  // Validate form before submitting
  const { valid, data } = await r$.$validate()

  if (!valid) {
    logger.debug('Form has validation errors')
    return
  }

  try {
    // Call the withdraw service
    await libraryWithdrawService.create(
      props.game?.id as number,
      data.selectedUser,
    )

    toast.success(
      t('admin.library.withdrawSuccess', { name: props.game?.game.name }),
    )

    emit('close')
  } catch (error) {
    logger.error('Failed to withdraw game', { error })
    toast.error(t('admin.library.withdrawFailed'))
  } finally {
    isSubmitting.value = false
  }
}

const createUser = async (): Promise<void> => {
  // Validate new user form
  const { valid, data } = await newUserR$.$validate()

  if (!valid) {
    logger.debug('New user form has validation errors')
    return
  }

  try {
    //Call the user creation service
    const response = await userService.create(data.name, data.email)

    toast.success(`User ${response.email} created successfully.`)

    // Automatically select the newly created user for withdrawal
    formData.value.selectedUser = response.id

    // Reset new user form and hide it
    newUser.value.email = ''
    newUser.value.name = ''

    // Reset validation state
    newUserR$.$reset()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create user'
    toast.error(message)
    isSubmitting.value = false
  }
}

// Expose the submit function so parent components can call it
defineExpose({
  submit,
})
</script>
