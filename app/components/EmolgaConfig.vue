<script lang="ts" setup>
import type { BreadcrumbItem } from "#ui/types";
const props = defineProps<{ data: FullConfigData; onSubmit: () => void }>();
const { structure, initialContent, modifiableContent, changedPaths, savePath } =
  props.data;
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
function changeDetection(path: string) {
  console.log("changeDetection", path);
  const currentValue = getObjectProperty(content, path); // Access value property
  const initialValue = getObjectProperty(initialContent, path);

  if (currentValue !== initialValue) {
    changedPaths.add(path);
  } else {
    changedPaths.delete(path);
  }
}
function generateChangedContent(): any {
  const changesObject = {};
  changedPaths.forEach((path) => {
    setObjectProperty(changesObject, path, getObjectProperty(content, path)); // Access value property
  });
  return changesObject;
}
function save() {
  const changesToSend = structure.delta
    ? generateChangedContent()
    : modifiableContent;
  console.log("Changes to save:", JSON.stringify(changesToSend));
  $fetch(savePath, {
    method: "POST",
    body: changesToSend,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      changedPaths.clear();
      console.log("Changes saved successfully");
      props.onSubmit();
    })
    .catch((error) => {
      console.error("Error saving changes:", error);
    });
}
provide("changeDetection", changeDetection);
provide("changedPaths", changedPaths);

let currContent = content;
let currStructure: ConfigValue = structure;
function breadcrumb(label: string, index: number) {
  const path = route.params.path;
  const basePath = Array.isArray(path) ? path : path ? [path] : [];
  return {
    label,
    to: `${route.fullPath.replace("/" + basePath.join("/"), "")}${resolvedPath
      .slice(0, index)
      .map((p) => "/" + p)
      .join("")}`,
  };
}
const finishedPath: BreadcrumbItem[] = [breadcrumb(structure.name!, 0)];
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
  finishedPath.push(
    breadcrumb(
      currStructure.type === "LIST"
        ? (Number.parseInt(p) + 1).toString()
        : currStructure.type === "MAP"
        ? p
        : nextData.name ?? p,
      finishedPath.length
    )
  );
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
            :label="structure.submit ?? 'Speichern'"
            :icon="
              structure.submit ? 'i-lucide-arrow-big-right' : 'i-lucide-save'
            "
            :disabled="!changedPaths.size"
            @click="save"
          />
        </ClientOnly>
      </div>
      <EmolgaConfigPart v-model="currContent" :data="currStructure" />
    </div>
  </div>
</template>
