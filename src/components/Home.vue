<script setup lang="ts">

import {MY_DISCORD_TAG} from "../helpers/constants.ts";
import {useAuthState} from "../state/auth.ts";

const auth = useAuthState()
</script>

<template>
  <!--<div *ngIf="isLoaded()">
      <div class="text-center my-10">
          <a class="p-4 border-blue-500 border text-white rounded-xl hover:bg-blue-500 transition duration-100" *ngIf="isRegistered()" routerLink="/dashboard">{{getButtonText()}}</a>
          <a class="p-4 border-blue-500 border text-white rounded-xl hover:bg-blue-500 transition duration-100" *ngIf="!isRegistered()" href="{{login.LOGIN_URL}}">{{getButtonText()}}</a>
      </div>
  </div>-->

  <!-- create a centered white text with tailwind css -->
  <div class="mt-5 flex flex-row justify-center">
    <p class="text-xl text-gray-200 max-w-5xl">Hello there, ich bin ein Discord-Bot, der von <code>{{
        MY_DISCORD_TAG
      }}</code> (Flo | TecToast) programmiert wurde und hauptsächlich auf Pokémon spezialisiert ist. Hauptaufgabe ist
      die automatische Analyse von Pokemon Showdown Replays. Bei Fragen bitte an Flo wenden :) Falls ihr Feedback für
      mich habt, schreibt mir oder Flo eine PN!</p>
  </div>
  <div class="mt-5 flex flex-row justify-center">
    <p class="text-xl text-gray-200 max-w-5xl">Diese Seite hier befindet sich noch im Aufbau, später wird es eventuell
      ein Dashboard geben :)</p>
  </div>
  <!-- create a Login Button with TailwindCss -->
  <div v-if="auth.userdata.loggedIn" class="mt-5 flex flex-row justify-center">
    <RouterLink to="/dashboard" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Zum
      Dashboard [Alpha]
    </RouterLink>
  </div>
  <div v-else class="mt-5 flex flex-row justify-center">
    <button onclick="location.href='/api/login'" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" :disabled="auth.error">
      Bei Discord anmelden [Alpha]
    </button>
  </div>
</template>
