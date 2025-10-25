<template>
  <div>
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
        We've sent a secure login code to
        <span class="font-medium text-gray-900 dark:text-white">
          {{ email }}
        </span>
        . Enter the code below to sign in to your account.
      </p>
    </div>

    <!-- OTP Input Form -->
    <form class="mt-8" @submit.prevent="handleSubmit">
      <div>
        <label
          for="otp"
          class="block text-sm font-medium leading-6 text-gray-900 dark:text-white text-center"
        >
          Enter verification code
        </label>
        <div class="mt-3 flex justify-center gap-2">
          <input
            v-for="(_digit, index) in otpDigits"
            :key="index"
            :ref="(el) => setInputRef(el as HTMLInputElement, index)"
            v-model="otpDigits[index]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="block w-12 h-12 text-center rounded-md border-0 py-3 text-xl font-semibold text-gray-900 dark:text-white dark:bg-white/5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500"
            @input="handleInput(index, $event)"
            @keydown="handleKeydown(index, $event)"
            @paste="handlePaste"
          />
        </div>
      </div>

      <div class="mt-6">
        <button
          type="submit"
          :disabled="!isOtpComplete"
          class="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify code
        </button>
      </div>
    </form>

    <!-- Additional help -->
    <div class="mt-6 text-center">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Didn't receive the code? Check your spam folder or
        <button
          class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          @click="emit('back')"
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
            This code will expire in 20 minutes for security purposes. If you
            don't use it within that time, you'll need to request a new one.
          </p>
        </div>
      </div>
    </div>

    <!-- Back to form -->
    <div class="mt-8">
      <button
        class="flex w-full justify-center rounded-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:outline-offset-0"
        @click="emit('back')"
      >
        <ArrowLeftIcon class="mr-2 h-4 w-4" aria-hidden="true" />
        Send to different email
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  InboxIcon,
  LockClosedIcon,
} from '@heroicons/vue/24/outline'
import { ref, computed } from 'vue'

interface Props {
  email: string
}

interface Emits {
  (e: 'back'): void
  (e: 'verify', otp: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const OTP_LENGTH = 6
const otpDigits = ref<string[]>(Array.from({ length: OTP_LENGTH }, () => ''))
const inputRefs = ref<HTMLInputElement[]>([])

const isOtpComplete = computed<boolean>(() => {
  return otpDigits.value.every((digit) => digit !== '')
})

const setInputRef = (el: HTMLInputElement, index: number): void => {
  if (el) {
    inputRefs.value[index] = el
  }
}

const handleInput = (index: number, event: Event): void => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Only allow numeric values
  if (value && !/^\d$/.test(value)) {
    otpDigits.value[index] = ''
    return
  }

  // Move to next input if current has a value
  if (value && index < OTP_LENGTH - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handleKeydown = (index: number, event: KeyboardEvent): void => {
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }

  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent): void => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text')

  if (pastedData) {
    const digits = pastedData.replace(/\D/g, '').slice(0, OTP_LENGTH).split('')
    digits.forEach((digit, index) => {
      if (index < OTP_LENGTH) {
        otpDigits.value[index] = digit
      }
    })

    // Focus on the next empty input or the last input
    const nextEmptyIndex = otpDigits.value.findIndex((d) => d === '')
    const focusIndex = nextEmptyIndex === -1 ? OTP_LENGTH - 1 : nextEmptyIndex
    inputRefs.value[focusIndex]?.focus()
  }
}

const handleSubmit = (): void => {
  if (isOtpComplete.value) {
    const otp = otpDigits.value.join('')
    emit('verify', otp)
  }
}
</script>
