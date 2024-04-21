<script setup lang="ts">
import draggable from "vuedraggable";
import type {PokemonData} from "~/utils/types";

const list = ref<PokemonData[]>([
  {
    displayName: "Emolga",
    sdName: "emolga",
    pointsOrTier: "D",
    types: ["Electric", "Flying"],
  },
  {
    displayName: "Laukaps",
    sdName: "karrablast",
    pointsOrTier: "D",
    types: ["Bug"],
  },
  {
    displayName: "Cavalanzas",
    sdName: "escavalier",
    pointsOrTier: "C",
    types: ["Bug", "Steel"],
  },
]);
const enabled = ref(true);
const dragging = ref(false);

function checkMove(e: any) {
  console.log("TYPE " + (typeof e) + " Future index: " + e.draggedContext.futureIndex);
}
function remove(pokemon: PokemonData) {
  list.value = list.value.filter((p) => p !== pokemon);
}
</script>

<template>
  <div>
    <h1 class="text-center text-2xl">Picks queuen</h1>
    <div class="flex flex-col justify-center items-center">
      <draggable
          :list="list"
          :disabled="!enabled"
          item-key="displayName"
          class="min-h-5 text-center mt-2"
          ghost-class="ghost"
          :move="checkMove"
          @start="dragging = true"
          @end="dragging = false"
      >
        <template #item="{ element }">
          <div class="cursor-grab flex" :class="{ 'not-draggable': !enabled }">
            <pokemon-row :pokemon="element" @remove="remove(element)"/>
          </div>
        </template>
      </draggable>
    </div>
    <!--    <h2>{{ list }}</h2>-->
  </div>
</template>

<style scoped>

/* used in the template */
/*noinspection CssUnusedSymbol*/
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
  cursor: grabbing;
}

</style>
