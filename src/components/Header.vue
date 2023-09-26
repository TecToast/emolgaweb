<script setup lang="ts">
import {computed, ref} from "vue";
import {BOT_INVITE_URL} from "../helpers/constants.ts";
import {useAuthState} from "../state/auth.ts";
import {useRoute} from "vue-router";

const miniNavbar = ref(false)
const auth = useAuthState()

const route = useRoute()
const homelook = computed(() => {
  if (route.path == "/") {
    return "bg-gray-900 text-white"
  } else {
    return "text-gray-300 hover:bg-gray-700 hover:text-white"
  }
})
let dropdownClasses = ref("hidden opacity-0 scale-95")
const onAppear = () => {
  dropdownClasses.value = "visible opacity-100 scale-100"
}
const onDisappear = () => {
  dropdownClasses.value = "opacity-0 scale-95";
  setTimeout(() => {
    dropdownClasses.value = "invisible opacity-0 scale-95";
  }, 500);
}
</script>

<template>
  <nav class="bg-gray-800">
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
          <RouterLink class="flex-shrink-0 flex items-center cursor-pointer" to="/">
            <img class="block lg:hidden h-16 w-auto" src="/src/assets/images/587.png" alt="Workflow">
            <img class="hidden lg:block h-16 w-auto" src="/src/assets/images/587withText.png" alt="Workflow">
          </RouterLink>
          <div class="hidden sm:block sm:ml-6 sm:mt-4">
            <div class="flex space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <RouterLink to="/" :class="homelook" class="px-3 py-2 rounded-md text-sm font-medium" aria-current="page">Home</RouterLink>

              <a :href="BOT_INVITE_URL" target="_blank" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Einladungslink</a>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


          <div v-if="auth.error">Es konnte keine Verbindung zum Server hergestellt werden, versuche es später noch einmal.</div>
          <!-- Profile dropdown -->
          <div class="ml-3 relative" v-if="auth.userdata.loggedIn">
            <div>
              <button type="button" @focus = "onAppear()" @focusout = "onDisappear()" class="bg-gray-800 flex justify-center items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                <div class="text-gray-300 mx-2">
                  {{auth.userdata.global_name}}
                </div>
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" :src="auth.userdata.avatar" alt="">
              </button>
            </div>
            <div :class = "dropdownClasses" style="z-index: 10;" class="transform opacity-0 origin-top-right transition ease-in-out duration-500 absolute right-0 mt-2 w-48 border border-gray-300 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
              <!-- Active: "bg-gray-100", Not Active: "" -->
              <a href="/api/logout" class="block px-2 mx-2 py-1 my-1 text-sm text-red-700 hover:bg-red-700 rounded-md hover:text-white" role="menuitem" tabindex="-1" id="user-menu-item-2">Ausloggen</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div :class = "miniNavbar ? 'block transform opacity-100 scale-100' : 'hidden transform opacity-0 scale-50'" class="sm:hidden transition ease-in-out duration-500" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <RouterLink to="/" :class="homelook" class="block px-3 py-2 rounded-md text-base font-medium" aria-current="page">Home</RouterLink>

        <a :href="BOT_INVITE_URL" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Einladungslink</a>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>
