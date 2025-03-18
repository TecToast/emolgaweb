<script lang="ts" setup>
import draggable from "vuedraggable";
const { data } = defineProps<{
  data: { type: "LIST" } & ConfigValue;
}>();

const content = defineModel<any>();
const listConfig = data.value[0];
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
      class="divide-y divide-(--ui-border)"
    >
      <template #item="{ index }">
        <div
          class="flex items-center justify-between not-last:pb-4 not-first:pt-4 gap-2"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-grip" />
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
            @click="content.splice(index, 1)"
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
    @click="handleConfigListAdd(listConfig, data, content)"
  />
</template>
