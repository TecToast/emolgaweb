<script lang="ts" setup>
const { data } = defineProps<{
  data: ConfigValue;
}>();

const content = defineModel<any>();
</script>

<template>
  <div>
    <h2 class="mb-4 text-(--ui-text-muted)">{{ data.desc }}</h2>
    <EmolgaConfigClass v-if="data.type === 'CLASS'" v-model="content" :data />
    <EmolgaConfigList
      v-else-if="data.type === 'LIST'"
      v-model="content"
      :data
    />
    <EmolgaConfigMap v-else-if="data.type === 'MAP'" v-model="content" :data />
  </div>
</template>
