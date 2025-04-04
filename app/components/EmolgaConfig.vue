<script lang="ts" setup>
import type { BreadcrumbItem } from "#ui/types";
const { structure, initialContent, modifiableContent } = defineProps<{
  structure: ConfigValue;
  initialContent: any;
  modifiableContent: any;
}>();
const content = reactive(modifiableContent);
const route = useRoute();
const path = route.params.path;
const resolvedPath = (
  typeof path === "string" ? (path === "" ? [] : [path]) : path
)!;

function getObjectProperty(obj: any, path: string) {
  const keys = path.split("/");
  let current = obj;
  for (const key of keys) {
    if (current === null || typeof current !== "object" || !(key in current)) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

// Utility function to set a nested property by path
function setObjectProperty(obj: any, path: string, value: any) {
  const keys = path.split("/");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!;
    if (current[key] === null || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]!] = value;
}
const changedPaths: Ref<Set<string>> = ref(new Set());
function changeDetection(path: string, value: any) {
  console.log("changeDetection", path, value);
  const currentValue = getObjectProperty(content, path); // Access value property
  const initialValue = getObjectProperty(initialContent, path);

  if (currentValue !== initialValue) {
    changedPaths.value.add(path);
  } else {
    changedPaths.value.delete(path);
  }
}
function generateChangedContent(): any {
  const changesObject = {};
  changedPaths.value.forEach((path) => {
    setObjectProperty(changesObject, path, getObjectProperty(content, path)); // Access value property
  });
  return changesObject;
}
function save() {
  const changes = generateChangedContent();
  console.log("Changes to save:", changes);
}
provide("changeDetection", changeDetection);
provide("changedPaths", changedPaths);
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
      <div class="flex items-center justify-between">
        <UBreadcrumb :items="finishedPath" class="mb-4" />
        <ClientOnly>
          <UButton
            label="Speichern"
            icon="i-lucide-save"
            :disabled="!changedPaths.size"
            @click="save"
          />
        </ClientOnly>
      </div>
      {{ changedPaths }}
      <EmolgaConfigPart v-model="currContent" :data="currStructure" />
    </div>
  </div>
</template>
