<script lang="ts" setup>
const { data } = defineProps<{
  data: { type: "CLASS" } & ConfigValue;
}>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const content = defineModel<any>();
const { guild, path } = useRoute().params;
const resolvedPath = (
  typeof path === "string" ? (path === "" ? [] : [path]) : path
)!;
const resolvedPathBase =
  resolvedPath.join("/") + (resolvedPath.length ? "/" : "");
</script>

<template>
  <UPageCard
    variant="subtle"
    :ui="{ container: 'divide-y divide-(--ui-border)' }"
  >
    <template v-for="[key, value] of Object.entries(data.value)" :key="key">
      <UFormField
        v-if="!value.noconfig"
        :name="value.name"
        :label="value.name"
        :description="value.desc"
        class="flex items-center justify-between not-last:pb-4 gap-2"
        :ui="{ container: 'shrink-0' }"
      >
        <UTextarea
          v-if="value.type === 'STRING'"
          v-model="content[key]"
          autocomplete="off"
          autoresize
          :rows="1"
          :ui="{ base: 'resize-none' }"
        />
        <UInput
          v-else-if="['INT', 'LONG', 'DOUBLE'].includes(value.type)"
          v-model="content[key]"
          type="number"
        />
        <USwitch v-else-if="value.type === 'BOOLEAN'" v-model="content[key]" />
        <USelect
          v-else-if="value.type === 'ENUM'"
          v-model="content[key]"
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
          :to="{
            name: 'dashboard-guild-signup-config-path',
            params: { guild, path: `${resolvedPathBase}${key}` },
          }"
          variant="soft"
          icon="i-lucide-pencil"
          >Bearbeiten</UButton
        >
      </UFormField>
    </template>
  </UPageCard>
</template>
