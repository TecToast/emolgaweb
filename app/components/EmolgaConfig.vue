<script lang="ts" setup>
import type { BreadcrumbItem } from "#ui/types";
const { structure, initialContent } = defineProps<{
  structure: ConfigValue;

  initialContent: any;
}>();
const content = reactive(initialContent);
const route = useRoute();
const path = route.params.path;
const resolvedPath = (
  typeof path === "string" ? (path === "" ? [] : [path]) : path
)!;
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
  if (currStructure.type === "CLASS") {
    const nextStructure = currStructure.value[p];
    if (!nextStructure) {
      break;
    }
    currContent = currContent[p];
    currStructure = nextStructure;
  } else if (currStructure.type === "LIST") {
    const nextData = currStructure.value[0];
    if (!nextData) {
      break;
    }
    currContent = currContent[p];
    currStructure = nextData;
  } else if (currStructure.type === "MAP") {
    const nextData = currStructure.value[1];
    if (!nextData) {
      break;
    }
    currContent = currContent[p];
    currStructure = nextData;
  }
}

/*function parseTree(tree: ConfigObject): TreeItem[] {
  return Object.entries(tree).map(([key, value]) => {
    if (value.type === "CLASS") {
      return { label: value.name, children: parseTree(value.value) };
    }
    if (value.type === "SEALED") {
      return {
        label: value.name ?? key,
        children: parseTree(value.value.value.value),
      };
    }
    return { label: value.name ?? key };
    // if ([].includes(value.type)) {}
  });
}
const tree = ref(parseTree(data));*/
</script>

<template>
  <div class="w-full lg:max-w-4xl mx-auto">
    <div>
      <UBreadcrumb :items="finishedPath" class="mb-4" />
      <EmolgaConfigPart v-model="currContent" :data="currStructure" />
    </div>
  </div>
</template>
