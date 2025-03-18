<script lang="ts" setup>
const { data } = defineProps<{
  data: { type: "CLASS" } & ConfigValue;
}>();
const content = defineModel<any>();
</script>

<template>
  <UPageCard
    variant="subtle"
    :ui="{ container: 'divide-y divide-(--ui-border)' }"
  >
    <template v-for="[key, value] of Object.entries(data.value)" :key="key">
      <EmolgaConfigFormField
        v-model="content[key]"
        :key-param="key"
        :value="value"
      />
    </template>
  </UPageCard>
</template>
