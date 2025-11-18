<script setup lang="ts">
const modelPokemon = defineModel<string>("pokemon");
const modelTier = defineModel<string>("tier");
const emit = defineEmits(["monchange", "tierchange"]);
</script>

<template>
  <div class="flex gap-2">
    <UTextarea
      v-model="modelPokemon"
      autocomplete="off"
      autoresize
      :rows="1"
      :ui="{ base: 'resize-none' }"
      @input="emit('monchange')"
    />
    <UInput v-model="modelTier" class="w-32" @input="emit('tierchange')" />
  </div>
</template>
