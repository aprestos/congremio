<template>
  <Transition
    name="slide-fade"
    mode="out-in"
    enter-active-class="transition-all duration-500 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 translate-y-8"
    leave-to-class="opacity-0 -translate-y-8"
  >
    <!-- Sign In Form -->
    <div v-if="!linkSent" key="form">
      <!-- Lock icon -->
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30"
      >
        <LockClosedIcon
          class="h-6 w-6 text-indigo-600 dark:text-indigo-400"
          aria-hidden="true"
        />
      </div>

      <!-- Header -->
      <div class="mt-6 text-center">
        <h2
          class="text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white"
        >
          Sign in to your account
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a secure magic link to
          sign in
        </p>
      </div>

      <!-- Form -->
      <form class="mt-8 space-y-6" @submit.prevent="submit">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
          >
            Email address
          </label>
          <div class="relative mt-2">
            <input
              id="email"
              v-model="email"
              type="email"
              name="email"
              autocomplete="email"
              required
              placeholder="Enter your email address"
              class="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 dark:text-white dark:bg-white/5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <AtSymbolIcon
                class="h-5 w-5 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !email"
            class="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">
              <PaperAirplaneIcon class="h-4 w-4" aria-hidden="true" />
            </span>
            <svg
              v-else
              class="h-4 w-4 animate-spin"
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
            {{ isLoading ? 'Sending magic link...' : 'Send magic link' }}
          </button>
        </div>
      </form>

      <!-- Social Login Section -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span
              class="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400"
              >Or continue with</span
            >
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            disabled
            class="flex w-full items-center justify-center gap-3 rounded-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:ring-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            disabled
            class="flex w-full items-center justify-center gap-3 rounded-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:ring-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
              />
            </svg>
            <span>Apple</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-else key="success">
      <!-- Inbox icon -->
      <div
        class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30"
      >
        <InboxIcon
          class="h-8 w-8 text-blue-600 dark:text-blue-400"
          aria-hidden="true"
        />
      </div>

      <!-- Main content -->
      <div class="mt-6 text-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Check your inbox!
        </h3>
        <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
          We've sent a secure login link to
          <span class="font-medium text-gray-900 dark:text-white">{{
            email
          }}</span
          >. Click the link in the email to sign in to your account.
        </p>
      </div>

      <!-- Additional help -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Didn't receive the email? Check your spam folder or
          <button
            class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            @click="goBack"
          >
            try again
          </button>
        </p>
      </div>

      <!-- Security note -->
      <div class="mt-6 rounded-md bg-gray-50 dark:bg-white/5 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <LockClosedIcon
              class="h-5 w-5 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
          </div>
          <div class="ml-3">
            <p class="text-xs text-gray-600 dark:text-gray-400">
              This link will expire in 20 minutes for security purposes. If you
              don't use it within that time, you'll need to request a new one.
            </p>
          </div>
        </div>
      </div>

      <!-- Back to form -->
      <div class="mt-8">
        <button
          class="flex w-full justify-center rounded-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:outline-offset-0"
          @click="goBack"
        >
          <ArrowLeftIcon class="mr-2 h-4 w-4" aria-hidden="true" />
          Send to different email
        </button>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import {
  ArrowLeftIcon,
  AtSymbolIcon,
  InboxIcon,
  LockClosedIcon,
  PaperAirplaneIcon,
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { authService } from '@/features/auth/service.ts'

const email = ref('')
const isLoading = ref(false)
const linkSent = ref(false)

const submit = async (): Promise<void> => {
  if (!email.value || isLoading.value) return

  try {
    isLoading.value = true
    await authService.signInWithOTP(email.value)
    linkSent.value = true
  } catch (error) {
    console.error('Error sending magic link:', error)
  } finally {
    isLoading.value = false
  }
}

const goBack = (): void => {
  linkSent.value = false
  isLoading.value = false
}
</script>
