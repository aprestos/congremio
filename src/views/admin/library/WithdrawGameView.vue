<template>
  <div class="space-y-8">
    <!-- Game Card -->
    <div class="">
      <div class="flex items-center space-x-4">
        <div class="shrink-0">
          <img
            class="size-16 rounded-lg object-cover shadow-sm"
            :src="game?.game.image || '/placeholder-game.jpg'"
            :alt="game?.game.name || 'Game image'"
          />
        </div>
        <div class="flex-1 min-w-0">
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white truncate"
          >
            {{ game?.game.name || 'Unknown Game' }}
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
              {{ game?.game.year || 'Unknown' }}
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
      <div class="">
        <CSelect
          v-if="!showCreateUser"
          id="withdraw-to-user"
          v-model="formData.selectedUser"
          label="Withdraw to"
          option-label="email"
          option-value="id"
          placeholder="Search and select a user..."
          :on-search="userService.search"
          :errors="r$.$errors.selectedUser"
        />

        <!-- Create User Form -->
        <div
          v-if="showCreateUser"
          class="mt-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
        >
          <div class="space-y-4">
            <CInput
              id="new-user-email"
              v-model="newUser.email"
              label="Email"
              type="email"
              placeholder="Enter email address"
              :errors="newUserR$.$errors.email"
            />
          </div>
        </div>
      </div>
      <!-- Create New User Option -->
      <div class="">
        <button
          type="button"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          @click="showCreateUser = !showCreateUser"
        >
          {{ showCreateUser ? 'Select an existing user' : '+ Create new user' }}
        </button>
      </div>

      <!-- Action Buttons -->
      <div
        class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
      >
        <CButton
          type="submit"
          variant="yellow"
          :loading="isSubmitting"
          :disabled="isCreatingUser"
          loading-text="Withdrawing..."
          class="sm:col-start-2"
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
          Withdraw Game
        </CButton>
        <CButton
          type="button"
          variant="secondary"
          class="mt-3 sm:col-start-1 sm:mt-0"
          @click="emit('close')"
        >
          Cancel
        </CButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core'
import { required, email } from '@regle/rules'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import 'vue-sonner/style.css'

import CButton from '@/components/CButton.vue'
import CSelect from '@/components/CSelect.vue'
import CInput from '@/components/CInput.vue'
import type { LibraryGame } from '@/features/library/game.model.ts'
import libraryWithdrawService from '@/features/library/withdraws/service.ts'
import { userService } from '@/features/users/service.ts'

interface Props {
  game: LibraryGame | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'game-withdrawn': []
  close: []
}>()

const formData = ref<{ selectedUser: string | undefined }>({
  selectedUser: undefined,
})

const isSubmitting = ref(false)
const showCreateUser = ref(false)
const isCreatingUser = ref(false)

const newUser = ref({
  email: '',
})

// Main form validation
const { r$ } = useRegle(formData, {
  selectedUser: { required },
})

// New user form validation
const { r$: newUserR$ } = useRegle(newUser, {
  email: { required, email },
})

const submit = async (): Promise<void> => {
  if (isSubmitting.value) return

  if (showCreateUser.value) {
    await createUser()
  }

  // Validate form before submitting
  const { valid, data } = await r$.$validate()

  if (!valid) {
    console.log('Form has validation errors')
    return
  }

  isSubmitting.value = true

  try {
    // Call the withdraw service
    await libraryWithdrawService.post(
      props.game?.id as number,
      data.selectedUser,
    )

    toast.success('Game has been withdrawn from the library')

    // Emit event to notify parent that game was withdrawn successfully
    emit('game-withdrawn')
  } catch (error) {
    console.error('Error withdrawing game:', error)
    toast.error('Failed to withdraw game. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const createUser = async (): Promise<void> => {
  if (isCreatingUser.value) return

  // Validate new user form
  const { valid, data } = await newUserR$.$validate()

  if (!valid) {
    console.log('New user form has validation errors')
    return
  }

  isCreatingUser.value = true

  try {
    //Call the user creation service
    const response = await userService.create(data.email)

    toast.success(`User ${response.email} created successfully.`)

    // Automatically select the newly created user for withdrawal
    formData.value.selectedUser = response.id

    // Reset new user form and hide it
    newUser.value.email = ''
    showCreateUser.value = false

    // Reset validation state
    newUserR$.$reset()
  } catch (error) {
    console.error('Error creating user:')
    toast.error(error.message)
  } finally {
    isCreatingUser.value = false
  }
}

// Expose the submit function so parent components can call it
defineExpose({
  submit,
})
</script>
