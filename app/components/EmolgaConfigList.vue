<script lang="ts" setup>
import draggable from "vuedraggable";
const { data } = defineProps<{
  data: { type: "LIST" } & ConfigValue;
}>();

const content = defineModel<any>();
const listConfig = data.value[0];
const changeDetection: (path: string) => void = inject("changeDetection")!;
function handleAdd() {
  handleConfigListAdd(listConfig, data, content.value);
  changeDetection(useResolvedPath(null));
}

function handleDelete(index: number) {
  content.value.splice(index, 1);
  changeDetection(useResolvedPath(null));
}
const draftPokemonEnabledSwitches = (() => {
  if (listConfig.name !== "DraftPokemon") return [];
  const features = new Set<string>();

  content.value.forEach((mon: any) => {
    Object.entries(mon).forEach(([key, value]) => {
      if (value) {
        features.add(key);
      }
    });
  });
  return features;
})();
provide("draftPokemonEnabledSwitches", draftPokemonEnabledSwitches);
</script>

<template>
  <UPageCard variant="subtle">
    <UAlert
      v-if="!content.length"
      variant="subtle"
      title="Keine Einträge verfügbar."
    />
    <draggable
      v-else
      :list="content"
      :item-key="(item: any) => item"
      :move="() => changeDetection(useResolvedPath(null))"
      handle=".draghandle"
      class="divide-y divide-default"
    >
      <template #item="{ index }">
        <div
          class="flex items-center justify-between not-last:pb-4 not-first:pt-4 gap-2"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-grip" class="draghandle cursor-pointer" />
            <UBadge color="info">{{ index + 1 }}</UBadge>
          </div>

          <EmolgaConfigFormInput
            v-model="content[index]"
            :key-param="index.toString()"
            :value="data.value[0]"
          />
          <UButton
            :ui="{ base: 'shrink-0' }"
            size="lg"
            color="error"
            @click="handleDelete(index)"
          >
            <UIcon name="i-lucide-trash" />
          </UButton>
        </div>
      </template>
    </draggable>
  </UPageCard>
  <UButton
    icon="i-lucide-plus"
    label="Eintrag hinzufügen"
    class="w-full mt-4"
    @click="handleAdd"
  />
</template>
