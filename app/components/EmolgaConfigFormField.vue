<script setup lang="ts">
import EmolgaConfigFormInput from "./EmolgaConfigFormInput.vue";
const { keyParam, value } = defineProps<{
  keyParam: string;
  value: ConfigValue;
}>();
const content = defineModel<any>();
async function handleNullableAddLocal() {
  await handleNullableAdd(value, content);
}
</script>

<template>
  <UFormField
    v-if="!value.noconfig"
    :name="value.name"
    :label="value.name"
    :description="value.desc"
    class="flex items-center justify-between not-last:pb-4 gap-2"
    :ui="{ container: 'shrink-0' }"
  >
    <div class="flex gap-4">
      <UButton
        v-if="content === null"
        label="Hinzufügen"
        icon="i-lucide-plus"
        @click="handleNullableAddLocal()"
      />
      <template v-else>
        <EmolgaConfigFormInput
          v-model="content"
          :value="value"
          :key-param="keyParam"
        />
        <UButton
          v-if="value.nullable"
          :ui="{ base: 'shrink-0' }"
          size="lg"
          color="error"
          @click="content = null"
        >
          <UIcon name="i-lucide-trash" />
        </UButton>
      </template>
    </div>
  </UFormField>
</template>
