<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()
const leaguename = route.params.leaguename

const testroutes: {name: string, url: string}[] = [
  {name: "Picks queuen", url: "/dashboard/leagues/" + leaguename + "/queuepicks"},
  {name: "Banane", url: "/"},
]
</script>

<template>
  <h1 class="text-center text-2xl">{{ leaguename }}</h1>
  <div class="flex flex-col md:flex-row md:space-x-2 justify-center border-b-2 border-gray-300 pb-2 mb-5">
    <RouterLink v-for="rou in testroutes" :to="rou.url"
                class="block mt-2 text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {{ rou.name }}
    </RouterLink>
  </div>
  <RouterView></RouterView>
</template>
