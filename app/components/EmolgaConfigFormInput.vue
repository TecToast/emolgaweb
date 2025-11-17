<script setup lang="ts">
const { keyParam, value } = defineProps<{
  keyParam: string;
  value: ConfigValue;
}>();
const content = defineModel<any>();
const route = useRoute();
const { guild } = route.params;
const channelOptions = await useGuildChannels(
  guild as string,
  value.longType === "CHANNEL"
);
const roleOptions = await useGuildRoles(
  guild as string,
  value.longType === "ROLE"
);

const changeDetection: (path: string) => void = inject("changeDetection")!;
function changeDetect() {
  changeDetection(useResolvedPath(keyParam));
}
const resolvedLink = computed(() => {
  const path = route.params.path;
  const basePath = Array.isArray(path) ? path : path ? [path] : [];
  return `${route.fullPath.replace(basePath.join("/"), "")}${useResolvedPath(keyParam)}`;
});
// TODO: maybe add a visual indication for changed paths
/*const changedPaths: Ref<string[]> = inject("changedPaths")!;
const changedClasses = computed(() => {
  const completePath = resolvedPathBase + keyParam;
  console.log("COMPLETE: " + completePath);
  return changedPaths.value.includes(completePath)
    ? "border-2 border-secondary-300"
    : "";
});*/
</script>

<template>
  <DraftPokemon v-if="value.name === 'DraftPokemon'" v-model:pokemon="content.name" v-model:tier="content.tier" />
  <UTextarea
    v-else-if="value.type === 'STRING'"
    v-model="content"
    autocomplete="off"
    autoresize
    :rows="1"
    :ui="{ base: 'resize-none' }"
    @change="changeDetect"
  />
  <USelectMenu
    v-else-if="value.longType === 'CHANNEL'"
    v-model="content"
    value-key="id"
    :items="channelOptions"
    class="w-48"
    @change="changeDetect"
  />
  <USelectMenu
    v-else-if="value.longType === 'ROLE'"
    v-model="content"
    value-key="id"
    :items="roleOptions"
    class="w-48"
    @change="changeDetect"
  />
  <UInput
    v-else-if="['INT', 'LONG', 'DOUBLE'].includes(value.type)"
    v-model="content"
    type="number"
    @change="changeDetect"
  />
  <USwitch
    v-else-if="value.type === 'BOOLEAN'"
    v-model="content"
    @change="changeDetect"
  />
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
    @change="changeDetect"
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
  <div v-else-if="value.type === 'SEALED'" class="flex items-center gap-2">
    <UBadge
      :label="'Typ: ' + value.value[content.type]?.name"
      color="neutral"
      variant="soft"
    />
    <UButton
      :to="resolvedLink"
      variant="soft"
      icon="i-lucide-pencil"
      >Bearbeiten</UButton
    >
  </div>
  <UButton
    v-else
    :to="resolvedLink"
    variant="soft"
    icon="i-lucide-pencil"
    >Bearbeiten</UButton
  >
</template>
