<script setup lang="ts">
const model = defineModel<{
  name: string;
  tier: string;
  quit: boolean;
  free: boolean;
  tera: boolean;
  noCost: boolean;
}>({ required: true });
const emit = defineEmits(["datachange"]);
const enabledSwitches =
  inject<Set<string>>("draftPokemonEnabledSwitches") ?? new Set<string>();
</script>

<template>
  <div class="flex gap-2 items-center">
    <UTextarea
      v-model="model.name"
      autocomplete="off"
      autoresize
      :rows="1"
      :ui="{ base: 'resize-none' }"
      @change="emit('datachange', 'name')"
    />
    <UInput
      v-model="model.tier"
      class="w-32"
      @change="emit('datachange', 'tier')"
    />
    <UCheckbox
      v-if="enabledSwitches.has('quit')"
      v-model="model.quit"
      label="Quit"
      @change="emit('datachange', 'quit')"
    />
    <UCheckbox
      v-if="enabledSwitches.has('free')"
      v-model="model.free"
      label="Free"
      @change="emit('datachange', 'free')"
    />
    <UCheckbox
        v-if="enabledSwitches.has('tera')"
        v-model="model.tera"
        label="Tera"
        @change="emit('datachange', 'tera')"
    />
    <UCheckbox
      v-if="enabledSwitches.has('noCost')"
      v-model="model.noCost"
      label="No Cost"
      @change="emit('datachange', 'noCost')"
    />
  </div>
</template>
