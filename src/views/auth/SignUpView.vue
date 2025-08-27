<template>
  <!-- Header -->
  <div class="mt-6 text-center">
    <h2 class="text-2xl font-bold leading-9 tracking-tight text-gray-900">
      Create your account
    </h2>
  </div>

  <!-- Form -->
  <form class="mt-8 space-y-6" @submit.prevent="submit">
    <div>
      <label
        for="name"
        class="block text-sm font-medium leading-6 text-gray-900"
      >
        Name
      </label>
      <div class="mt-2">
        <input
          v-model="name"
          type="text"
          name="name"
          id="name"
          autocomplete="name"
          required
          class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>

    <div>
      <label
        for="email"
        class="block text-sm font-medium leading-6 text-gray-900"
      >
        Email address
      </label>
      <div class="mt-2">
        <input
          v-model="email"
          type="email"
          name="email"
          id="email"
          autocomplete="email"
          required
          class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>

    <div>
      <label
        for="password"
        class="block text-sm font-medium leading-6 text-gray-900"
      >
        Password
      </label>
      <div class="mt-2">
        <input
          v-model="password"
          type="password"
          name="password"
          id="password"
          autocomplete="new-password"
          required
          class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>

    <div>
      <button
        type="submit"
        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Sign up
      </button>
    </div>
  </form>

  <p class="mt-8 text-center text-sm text-gray-500">
    Already a member?
    <RouterLink
      to="/auth/sign-in"
      class="font-semibold text-indigo-600 hover:text-indigo-500"
    >
      Sign in
    </RouterLink>
  </p>
</template>

<script lang="ts" setup>
import type { AuthError } from "@supabase/supabase-js";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { authService } from "@/features/auth/service.ts";

const name = ref("");
const email = ref("");
const password = ref("");

const submit = async () => {
  try {
    const { data, error } = await authService.signUp(
      name.value,
      email.value,
      password.value
    );
    console.log(JSON.stringify(data));
    console.log(JSON.stringify(error));
    //await router.push({ name: "home" });
  } catch (error) {
    toast.error((error as AuthError).message);
  }
};
</script>
