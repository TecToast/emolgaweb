<script setup lang="ts">
import {ref} from "vue";
import {BOT_INVITE_URL} from "~/utils/constants";

const miniNavbar = ref(false)
</script>

<template>
  <nav class="z-50 border-b-2 border-gray-500 border-opacity-50">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button type="button" @click="miniNavbar = !miniNavbar" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <svg :class = "miniNavbar ? 'hidden' : 'block'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg :class = "miniNavbar ? 'block' : 'hidden'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <NuxtLink class="flex-shrink-0 flex items-center cursor-pointer" to="/">
            <img class="block lg:hidden h-16 w-auto" src="/images/587.png" alt="Logo" />
            <img class="hidden lg:block h-16 w-auto" src="/images/587withText.png" alt="Logo" />
          </NuxtLink>
          <div class="hidden sm:block sm:ml-6 sm:mt-4">
            <div class="flex space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <NuxtLink to="/" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" aria-current="page">Home</NuxtLink>
              <NuxtLink :to="BOT_INVITE_URL" target="_blank" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Einladungslink</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div :class = "miniNavbar ? 'block transform opacity-100 scale-100' : 'hidden transform opacity-0 scale-50'" class="sm:hidden transition ease-in-out duration-500" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <NuxtLink to="/" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" aria-current="page">Home</NuxtLink>
        <NuxtLink :href="BOT_INVITE_URL" target="_blank" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Einladungslink</NuxtLink>
      </div>
    </div>
  </nav>
</template>


<style scoped>
</style>
