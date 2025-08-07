<script lang="ts" setup>
const { data } = defineProps<{
  data: { type: "MAP" } & ConfigValue;
}>();
const content = defineModel<any>();
const changeDetection: (path: string) => void = inject("changeDetection")!;
function handleAdd(name: string) {
  handleConfigMapAdd(data, content.value, name);
  changeDetection(useResolvedPath(""));
}
</script>

<template>
  <UPageCard variant="subtle">
    <UAlert
      v-if="!Object.keys(content).length"
      variant="subtle"
      title="Keine Einträge verfügbar."
    />
    <div v-else class="divide-y divide-(--ui-border)">
      <div
        v-for="key in Object.keys(content)"
        :key="key"
        class="flex items-center justify-between not-last:pb-4 not-first:pt-4 gap-2"
      >
        {{ key }}
        <EmolgaConfigFormInput
          v-model="content[key]"
          :key-param="key"
          :value="data.value[1]"
        />
        <UButton
          :ui="{ base: 'shrink-0' }"
          size="lg"
          color="error"
          @click="delete content[key]"
        >
          <UIcon name="i-lucide-trash" />
        </UButton>
      </div>
    </div>
  </UPageCard>
  <EmolgaConfigMapModal class="w-full mt-4" @new="(name) => handleAdd(name)" />
</template>
