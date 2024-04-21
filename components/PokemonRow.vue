<script setup lang="ts">
import type {PokemonData} from "~/utils/types";

const props = defineProps<{
  pokemon: PokemonData
}>()
const emit = defineEmits(['remove'])
</script>

<template>
  <div class="flex bg-gray-800 gap-10 items-center px-3">
    <img :src="`https://play.pokemonshowdown.com/sprites/gen5/${props.pokemon.sdName}.png`" alt="pokemon icon" class="w-16 h-16"/>
    <h3 class="w-32">{{ props.pokemon.displayName }}</h3>
    <div class="flex gap-2 w-12">
      <img v-for="type in props.pokemon.types" :src="`https://play.pokemonshowdown.com/sprites/types/${type}.png`" alt="Icon">
    </div>
    <p class="w-2">{{ props.pokemon.pointsOrTier }}</p>
    <UIcon class="w-5 h-5 rounded-md cursor-pointer" name="i-material-symbols-delete-outline" dynamic title="Löschen" @click="emit('remove')"/>
  </div>
</template>

<style scoped>

</style>
