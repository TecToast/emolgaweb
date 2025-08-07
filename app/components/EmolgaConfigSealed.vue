<script lang="ts" setup>
const { data } = defineProps<{
  data: { type: "SEALED" } & ConfigValue;
}>();
const content = defineModel<any>();
const chosenSubclass = ref<string>(content.value.type);
const dataOfSubclass = computed(
  () =>
    data.value[chosenSubclass.value]! as ConfigValue & {
      value: ConfigObject /*this is not always the case, but TypeScript...*/;
    }
);
const configState = useConfigState();
const changeDetection: (path: string) => void = inject("changeDetection")!;
function subclassChanged() {
  configState
    .getDefaultData(data.sealed + "#" + chosenSubclass.value)
    .then((res) => {
      Object.keys(content.value).forEach((k) => delete content.value[k]);
      console.log("res", res);
      Object.keys(res).forEach((k) => (content.value[k] = res[k]));
      changeDetection(useResolvedPath(null));
    });
}
</script>

<template>
  <div v-if="dataOfSubclass" class="flex flex-col gap-2">
    <div class="flex gap-2 items-center">
      <USelect
        v-model="chosenSubclass"
        size="lg"
        :items="
          Object.entries(data.value)
            .toSorted((a, b) => (a[1].prio ?? 9999) - (b[1].prio ?? 9999))
            .map(([k, v]) => ({
              id: k,
              label: v.name,
              description: v.desc,
            }))
        "
        value-key="id"
        class="w-48"
        @change="subclassChanged"
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
      <UBadge
        :label="'Beschreibung: ' + dataOfSubclass.desc"
        variant="outline"
        color="neutral"
        size="lg"
      />
    </div>
    <UPageCard
      variant="subtle"
      :ui="{ container: 'divide-y divide-(--ui-border)' }"
    >
      <template v-if="dataOfSubclass.value">
        <EmolgaConfigFormField
          v-for="[key, value] of Object.entries(dataOfSubclass.value)"
          :key="key"
          v-model="content[key]"
          :key-param="key"
          :value="value"
        />
      </template>
      <div v-else>Bei dieser Option gibt es keine weiteren Einstellungen.</div>
    </UPageCard>
  </div>
</template>
