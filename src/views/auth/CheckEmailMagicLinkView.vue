<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white">
    <body class="h-full">
    ```
  -->
  <div
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg sm:px-8"
      >
        <!-- Email icon -->
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100"
        >
          <EnvelopeIcon class="h-8 w-8 text-indigo-600" aria-hidden="true" />
        </div>

        <!-- Main content -->
        <div class="mt-6 text-center">
          <h3 class="text-lg font-semibold text-gray-900">Magic link sent!</h3>
          <p class="mt-3 text-sm text-gray-600">
            We've sent a secure login link to your email address. Click the link
            in the email to sign in to your account.
          </p>
        </div>

        <!-- Instructions -->
        <div class="mt-8">
          <div class="rounded-md bg-blue-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <InformationCircleIcon
                  class="h-5 w-5 text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">
                  What to do next:
                </h3>
                <div class="mt-2 text-sm text-blue-700">
                  <ul role="list" class="list-disc space-y-1 pl-5">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the magic link in the email</li>
                    <li>You'll be automatically signed in</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional help -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            Didn't receive the email? Check your spam folder or
            <router-link
              to="/auth/signin-magic-link"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              try again
            </router-link>
          </p>
        </div>

        <!-- Security note -->
        <div class="mt-6 rounded-md bg-gray-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <LockClosedIcon
                class="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <div class="ml-3">
              <p class="text-xs text-gray-600">
                This link will expire in 1 hour for security purposes. If you
                don't use it within that time, you'll need to request a new one.
              </p>
            </div>
          </div>
        </div>

        <!-- Back to sign in -->
        <div class="mt-8">
          <router-link
            to="/auth/signin"
            class="flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            <ArrowLeftIcon class="mr-2 h-4 w-4" aria-hidden="true" />
            Back to sign in
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  LockClosedIcon,
} from "@heroicons/vue/24/outline";
</script>
