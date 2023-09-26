<script setup lang="ts">
import {onMounted} from "vue";
import {leagueload} from "../../helpers/loaders.ts";
import {useLeagueState} from "../../state/pokemon.ts";

onMounted(async () => {
  await leagueload()
})

const league = useLeagueState()
</script>

<template>
  <div class="grid place-content-center">
    <template v-if="league.loaded">

      <div v-if="league.leagues.length > 0" class="grid place-content-center">
        <div class="text-2xl text-center mb-4">Du nimmst derzeit an folgenden Ligen teil:</div>
        <div class="grid place-content-center">
          <RouterLink :to="'leagues/' + l.name" v-for="l in league.leagues" :key="l.name" class="text-lg text-center p-2 bg-cyan-600 hover:bg-cyan-800 transition duration-200 rounded">
            {{ l.name }}
          </RouterLink>
        </div>
      </div>
      <div v-else-if="league.error">Es konnte keine Verbindung zum Server hergestellt werden, versuche es später noch einmal.</div>
      <div v-else class="text-2xl">Scheinbar nimmst du derzeit nicht an einer von Emolga organisierten Liga teil.</div>
    </template>
    <PulseLoader v-else size="30px"></PulseLoader>
  </div>
</template>

