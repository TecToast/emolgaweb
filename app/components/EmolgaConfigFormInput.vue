<script setup lang="ts">
const { value } = defineProps<{
  keyParam: string;
  value: ConfigValue;
}>();
const content = defineModel<any>();
const { guild, path } = useRoute().params;
const resolvedPath = (
  typeof path === "string" ? (path === "" ? [] : [path]) : path
)!;
const resolvedPathBase =
  resolvedPath.join("/") + (resolvedPath.length ? "/" : "");
const channelOptions = await useGuildChannels(
  guild as string,
  value.longType === "CHANNEL"
);
// WATCHER :D
</script>

<template>
  <UTextarea
    v-if="value.type === 'STRING'"
    v-model="content"
    autocomplete="off"
    autoresize
    :rows="1"
    :ui="{ base: 'resize-none' }"
  />
  <USelectMenu
    v-else-if="value.longType === 'CHANNEL'"
    v-model="content"
    value-key="id"
    :items="channelOptions"
    class="w-48"
  />
  <UInput
    v-else-if="['INT', 'LONG', 'DOUBLE'].includes(value.type)"
    v-model="content"
    type="number"
  />
  <USwitch v-else-if="value.type === 'BOOLEAN'" v-model="content" />
  <USelect
    v-else-if="value.type === 'ENUM'"
    v-model="content"
    :items="
      Object.entries(value.value).map(([k, v]) => ({
        id: k,
        label: v.name,
        description: v.desc,
      }))
    "
    value-key="id"
    class="w-48"
  >
    <template #item="{ item }">
      <div>
        <div>{{ item.label }}</div>
        <div class="text-sm text-gray-500">
          {{ item.description }}
        </div>
      </div>
    </template>
  </USelect>
  <UButton
    v-else
    :to="`/dashboard/${guild}/signup/config/${resolvedPathBase}${keyParam}`"
    variant="soft"
    icon="i-lucide-pencil"
    >Bearbeiten</UButton
  >
</template>
