<script setup lang="ts">
import {
  InformationCircleIcon,
  XMarkIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconCheck,
} from '@tabler/icons-vue'
import { onMounted, ref } from 'vue'
import { authService } from '@/features/auth/service.ts'
import router from '@/router'
import { RouteNames } from '@/router/routeNames.ts'
import { tenantStore } from '@/stores/tenant.ts'
import CInput from '@/components/CInput.vue'

const isValidating = ref(true)
const isSuccess = ref(false)
const needsDisplayName = ref(false)
const isUpdatingDisplayName = ref(false)
const errorMessage = ref('')
const countdown = ref(5)
const displayName = ref('')
const displayNameErrors = ref<string[]>([])

onMounted(async () => {
  try {
    // Check if user is authenticated
    const { data } = await authService.getUser()

    if (data?.user) {
      // Check if user already has roles for this tenant
      const tenantId = tenantStore.value?.id
      const userRoles = data.user.app_metadata?.roles as
        | Record<string, any>
        | undefined
      const hasRoleForTenant = tenantId && userRoles && userRoles[tenantId]

      if (!hasRoleForTenant) {
        // User doesn't have roles for this tenant, set up the relationship
        await authService.setTenant(data.user.id)
      } else {
        console.log(
          'User already has role for this tenant:',
          userRoles[tenantId],
        )
      }

      // Check if user has display_name in user_metadata
      const userDisplayName =
        (data.user.user_metadata?.display_name as string) || ''

      if (!userDisplayName) {
        // User needs to set display name
        isValidating.value = false
        needsDisplayName.value = true
      } else {
        // Show success state
        isValidating.value = false
        isSuccess.value = true

        // Start countdown timer
        startCountdown()
      }
    } else {
      throw new Error('No authenticated user found')
    }
  } catch (error) {
    console.error('Authentication confirmation failed:', error)
    isValidating.value = false
    isSuccess.value = false
    errorMessage.value =
      error instanceof Error ? error.message : 'An unexpected error occurred'
  }
})

const updateDisplayName = async (): Promise<void> => {
  displayNameErrors.value = []

  if (!displayName.value.trim()) {
    displayNameErrors.value.push('Display name is required')
    return
  }

  if (displayName.value.trim().length < 2) {
    displayNameErrors.value.push('Display name must be at least 2 characters')
    return
  }

  isUpdatingDisplayName.value = true

  try {
    await authService.updateUserMetadata({
      display_name: displayName.value.trim(),
    })

    // Update completed, show success state
    needsDisplayName.value = false
    isSuccess.value = true
    startCountdown()
  } catch (error) {
    console.error('Failed to update display name:', error)
    displayNameErrors.value.push(
      error instanceof Error ? error.message : 'Failed to update display name',
    )
  } finally {
    isUpdatingDisplayName.value = false
  }
}

const startCountdown = (): void => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      void redirectToHome()
    }
  }, 1000)
}

const redirectToHome = async (): Promise<void> => {
  await router.push({ name: RouteNames.public.library })
}

const backToSignIn = async (): Promise<void> => {
  await router.push({ name: RouteNames.auth.signIn })
}
</script>

<template>
  <div v-if="isValidating" class="mt-6 text-center">
    <!-- Loading state -->
    <div
      class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30"
    >
      <svg
        class="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
    <h2 class="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
      Confirming your sign-in...
    </h2>
    <p class="mt-2 text-md text-gray-600 dark:text-gray-400">
      Please wait while we verify your authentication.
    </p>
  </div>

  <div v-else-if="isSuccess" class="mt-6 text-center">
    <!-- Success state -->
    <div
      class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
    >
      <IconCheck
        class="h-8 w-8 text-green-600 dark:text-green-400"
        aria-hidden="true"
      />
    </div>

    <h2 class="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
      Welcome back!
    </h2>
    <p class="mt-2 text-md text-gray-600 dark:text-gray-400">
      You have been successfully signed in to your account.
    </p>

    <!-- Countdown and redirect info -->
    <div class="mt-8 rounded-md bg-green-50 dark:bg-green-900/20 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <InformationCircleIcon
            class="h-5 w-5 text-green-400 dark:text-green-500"
            aria-hidden="true"
          />
        </div>
        <div class="ml-3">
          <p class="text-sm text-green-800 dark:text-green-300">
            Redirecting you to the home page in {{ countdown }} seconds...
          </p>
        </div>
      </div>
    </div>

    <!-- Manual redirect button -->
    <div class="mt-6">
      <button
        class="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500"
        @click="redirectToHome"
      >
        <IconArrowNarrowRight class="h-4 w-4" aria-hidden="true" />
        Continue to Home
      </button>
    </div>
  </div>

  <div v-else-if="needsDisplayName" class="mt-6 text-center">
    <!-- Display Name required state -->
    <div
      class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30"
    >
      <UserIcon
        class="h-8 w-8 text-yellow-600 dark:text-yellow-400"
        aria-hidden="true"
      />
    </div>

    <h2 class="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
      Almost there!
    </h2>
    <p class="mt-2 text-md text-gray-600 dark:text-gray-400">
      Please provide a display name to complete your profile.
    </p>

    <!-- Display Name form -->
    <div class="mt-4">
      <CInput
        id="display-name"
        v-model="displayName"
        label="Display Name"
        type="text"
        placeholder="Enter your display name"
        :errors="displayNameErrors"
      />
    </div>

    <div class="mt-6">
      <button
        class="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isUpdatingDisplayName"
        @click="updateDisplayName"
      >
        <IconCheck class="h-4 w-4" aria-hidden="true" />
        <span v-if="isUpdatingDisplayName">Updating...</span>
        <span v-else>Update Display Name</span>
      </button>
    </div>
  </div>

  <div v-else class="mt-6 text-center">
    <!-- Error state -->
    <div
      class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
    >
      <XMarkIcon
        class="h-8 w-8 text-red-600 dark:text-red-400"
        aria-hidden="true"
      />
    </div>

    <h2 class="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
      Authentication failed
    </h2>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
      We couldn't verify your sign-in. The link may have expired or been used
      already.
    </p>

    <!-- Error details -->
    <div class="mt-8 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <XMarkIcon
            class="h-5 w-5 text-red-400 dark:text-red-500"
            aria-hidden="true"
          />
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-800 dark:text-red-300">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>

    <!-- Back to sign in button -->
    <div class="mt-6">
      <button
        class="flex w-full justify-center items-center gap-2 rounded-md bg-white dark:bg-white/5 px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:outline-offset-0"
        @click="backToSignIn"
      >
        <IconArrowNarrowLeft class="h-4 w-4" aria-hidden="true" />
        Back to Sign In
      </button>
    </div>
  </div>
</template>

<style scoped></style>
