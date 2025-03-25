<script lang="ts" setup>
import type { BreadcrumbItem } from "#ui/types";
const { structure, initialContent } = defineProps<{
  structure: ConfigValue;

  initialContent: any;
}>();
const content = reactive(initialContent);
const changedContent = reactive({});
const route = useRoute();
const path = route.params.path;
const resolvedPath = (
  typeof path === "string" ? (path === "" ? [] : [path]) : path
)!;
provide("changedContent", changedContent);
const finishedPath: BreadcrumbItem[] = [structure.name, ...resolvedPath].map(
  (item, index) => ({
    label: item,
    to: `/dashboard/${route.params.guild}/signup/config${resolvedPath
      .slice(0, index)
      .map((p) => "/" + p)
      .join("")}`,
  })
);
let currContent = content;
let currStructure: ConfigValue = structure;
for (const p of resolvedPath) {
  const nextData: ConfigValue | undefined =
    currStructure.type === "CLASS"
      ? currStructure.value[p]
      : currStructure.type === "LIST"
      ? currStructure.value[0]
      : currStructure.type === "MAP"
      ? currStructure.value[1]
      : undefined;
  if (!nextData) {
    break;
  }
  currContent = currContent[p];
  currStructure = nextData;
}
</script>

<template>
  <div class="w-full lg:max-w-4xl mx-auto">
    <div>
      <UBreadcrumb :items="finishedPath" class="mb-4" />
      {{ changedContent }}
      <EmolgaConfigPart v-model="currContent" :data="currStructure" />
    </div>
  </div>
</template>
