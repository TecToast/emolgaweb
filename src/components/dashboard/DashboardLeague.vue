<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()
const leaguename = route.params.leaguename
console.log(route.path)
console.log(route.name)
const testroutes: { name: string, url: string, disabled?: boolean }[] = [
  {name: "Picks queuen", url: "/dashboard/leagues/" + leaguename + "/queuepicks"},
  {name: "Stärken/Schwächen (WIP)", url: "/dashboard/leagues/" + leaguename + "/managepicks", disabled: true},

]
</script>

<template>
  <h1 class="text-center text-2xl">{{ leaguename }}</h1>
  <div class="flex flex-col md:flex-row justify-center mb-5 border-y border-gray-700 mt-3">
    <div v-for="rou in testroutes">
      <RouterLink v-if="rou.disabled == undefined" :to="rou.url" active-class="bg-blue-900"
                  class="block text-center hover:bg-blue-700 text-gray-300 font-bold py-2 px-4 transition-all duration-200 border-gray-700 border-x">
        {{ rou.name }}
      </RouterLink>
      <div v-else
           class="block text-center text-gray-300 font-bold py-2 px-4 transition-all duration-200 cursor-not-allowed opacity-50 border-gray-700 border-x">
        {{ rou.name }}
      </div>
    </div>
  </div>
  <RouterView></RouterView>
</template>
