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
  <!--<div class="container">
      <div class="row">
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
              <div class="container-fluid">
                  <a class="navbar-brand" href="#">
                      <img src="/assets/images/587.png" alt="Emolga's Website" width="50%" (click)="dasor()">
                  </a>
                  <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                      data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                      aria-expanded="false" aria-label="Toggle navigation">
                      <span class="navbar-toggler-icon"></span>
                  </button>
                  <div class="collapse navbar-collapse" id="navbarSupportedContent">
                      <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="idnavbar">
                          <li class="nav-item">
                              <a class="nav-link active testing" aria-current="page" routerLink="/">Home</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link"
                                  href="https://discord.com/api/oauth2/authorize?client_id=723829878755164202&permissions=8&scope=bot">Einladungslink</a>
                          </li>
                      </ul>

                      <div *ngIf="isLoaded() && getUsername()" class="d-flex nav-item dropdown me-2">
                          <a class="nav-link dropdown-toggle text-light" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <img src="{{getAvatarUrl()}}" alt="Avatar" style="border-radius: 50%;width: 30px;">
                              {{getUsername()}}
                          </a>
                          <ul class="dropdown-menu dropdown-menu-dark bg-dark" aria-labelledby="navbarDropdown">
                              <li>
                                  <hr class="dropdown-divider text-light">
                              </li>
                              <li><a class="dropdown-item text-danger" href="#" (click)="logout()">Ausloggen</a></li>
                          </ul>
                      </div>

                      <a id="loginnava" *ngIf="isLoaded() && !getUsername()" class="formcontrol me-2" href="{{login.LOGIN_URL}}">
                          <button class="btn btn-outline-info" id="loginnavb">Bei Discord anmelden</button>
                      </a>
                  </div>
              </div>
          </nav>
      </div>
  </div>-->
  <!-- This example requires Tailwind CSS v2.0+ -->
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

              <a :href="BOT_INVITE_URL" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Einladungslink</a>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


          <!-- Profile dropdown -->
          <div class="ml-3 relative" v-if="!auth.loading">
            <div>
              <div v-if="auth.username" type="button" @focus = "onAppear()" @focusout = "onDisappear()" class="bg-gray-800 flex justify-center items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                <div class="text-gray-300 mx-2">
                  {{auth.username}}
                </div>
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" :src="auth.avatarUrl" alt="">
              </div>
            </div>
            <div :class = "dropdownClasses" style="z-index: 10;" class="transform opacity-0 origin-top-right transition ease-in-out duration-500 absolute right-0 mt-2 w-48 border border-gray-300 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
              <!-- Active: "bg-gray-100", Not Active: "" -->
              <a href="#" class="block px-2 py-1 mx-2 my-1 text-sm text-gray-300 hover:bg-gray-300 hover:text-gray-800 rounded-md" role="menuitem" tabindex="-1" id="user-menu-item-0">Banane</a>
              <a href="#" class="block px-2 py-1 mx-2 my-1 text-sm text-gray-300 hover:bg-gray-300 hover:text-gray-800 rounded-md" role="menuitem" tabindex="-1" id="user-menu-item-1">Keine Ahnung</a>
              <hr class="ml-2">
              <a href="https://emolga.tectoast.de:51216/api/logout" class="block px-2 mx-2 py-1 my-1 text-sm text-red-700 hover:bg-red-700 rounded-md hover:text-white" role="menuitem" tabindex="-1" id="user-menu-item-2">Ausloggen</a>
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
