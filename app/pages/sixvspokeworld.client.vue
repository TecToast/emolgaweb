<script setup lang="ts">
const toast = useToast();
const { data } = await useFetch<SixVsPokeworldConfig>("/api/emolga/sixvspokeworld/data");

const challenges = ref<SixVsPokeworldConfig["challenges"]>([]);
watch(
  data,
  (d) => {
    if (d) challenges.value = structuredClone(toRaw(d)).challenges;
  },
  { immediate: true }
);

const selectedIndex = ref(0);
const selectedChallenge = computed(() => challenges.value[selectedIndex.value]);

function addMilestone() {
  challenges.value.push({
    title: "",
    info: "",
    infoReward: "",
    easy: { title: "", text: "", fileKey: "", reward: "" },
    medium: { title: "", text: "", fileKey: "", reward: "" },
    hard: { title: "", text: "", fileKey: "", reward: "" },
  });
  selectedIndex.value = challenges.value.length - 1;
}

function deleteMilestone(index: number) {
  challenges.value.splice(index, 1);
  if (selectedIndex.value >= challenges.value.length) {
    selectedIndex.value = Math.max(0, challenges.value.length - 1);
  }
}

function imageUrl(fileKey: string) {
  return `/api/emolga/sixvspokeworld/image/${fileKey}`;
}

const uploadingFiles = ref<Record<string, boolean>>({});

async function handleFileUpload(exercise: { title: string; text: string; fileKey: string; reward: string }, difficulty: string, event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const uploadKey = `${selectedIndex.value}-${difficulty}`;
  uploadingFiles.value[uploadKey] = true;

  try {
    const formData = new FormData();
    formData.append("file", file);
    const result = await $fetch<{ key: string }>("/api/emolga/sixvspokeworld/image", {
      method: "POST",
      body: formData,
    });
    exercise.fileKey = result.key;
    toast.add({ title: "Bild hochgeladen!", color: "success" });
  } catch (e: any) {
    toast.add({
      title: "Fehler beim Hochladen",
      description: e?.message ?? "Unbekannter Fehler",
      color: "error",
    });
  } finally {
    delete uploadingFiles.value[uploadKey];
    input.value = "";
  }
}

function clearFile(exercise: { title: string; text: string; fileKey: string; reward: string }) {
  exercise.fileKey = "";
}

function isUploading(difficulty: string) {
  return !!uploadingFiles.value[`${selectedIndex.value}-${difficulty}`];
}

const isSaving = ref(false);
async function save() {
  isSaving.value = true;
  try {
    await $fetch("/api/emolga/sixvspokeworld/data", {
      method: "POST",
      body: { challenges: challenges.value },
    });
    toast.add({ title: "Erfolgreich gespeichert!", color: "success" });
  } catch (e: any) {
    toast.add({
      title: "Fehler beim Speichern",
      description: e?.message ?? "Unbekannter Fehler",
      color: "error",
    });
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="flex" style="height: calc(100dvh - var(--ui-header-height))">
    <div class="w-80 shrink-0 border-r border-default flex flex-col bg-elevated overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-default shrink-0">
        <h2 class="text-lg font-semibold">MSTs</h2>
        <UButton icon="i-lucide-plus" size="sm" color="primary" variant="soft" @click="addMilestone" />
      </div>

      <div class="flex-1 overflow-auto p-2 min-h-0">
        <div v-if="challenges.length === 0" class="p-4">
          <UAlert title="Keine MSTs vorhanden" variant="subtle" />
        </div>
        <div
          v-for="(challenge, index) in challenges"
          :key="index"
          class="flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer mb-1 transition-colors"
          :class="selectedIndex === index ? 'bg-accented' : 'hover:bg-muted'"
          @click="selectedIndex = index"
        >
          <span class="truncate">MST {{ index + 1 }}{{ challenge.title ? ` - ${challenge.title}` : '' }}</span>
          <UButton
            icon="i-lucide-trash-2"
            size="xs"
            color="error"
            variant="ghost"
            @click.stop="deleteMilestone(index)"
          />
        </div>
      </div>

      <div class="p-4 border-t border-default shrink-0">
        <UButton
          label="Speichern"
          icon="i-lucide-save"
          color="success"
          block
          :loading="isSaving"
          @click="save"
        />
      </div>
    </div>

    <div class="flex-1 overflow-auto p-6">
      <div v-if="!selectedChallenge" class="flex items-center justify-center h-full">
        <UAlert title="Wähle oder erstelle einen MST" variant="subtle" icon="i-lucide-info" />
      </div>

      <div v-else class="max-w-3xl mx-auto space-y-8">
        <h2 class="text-2xl font-bold">MST {{ selectedIndex + 1 }}</h2>

        <UCard>
          <template #header>
            <h3 class="font-semibold text-lg">Allgemeine Infos</h3>
          </template>
          <div class="space-y-4">
            <UFormField label="Titel" class="w-full">
              <UInput v-model="selectedChallenge.title" class="w-full" placeholder="WEG ZUR ARENA 1 Level Cap 11" />
            </UFormField>
            <UFormField label="Info" class="w-full">
              <UTextarea v-model="selectedChallenge.info" class="w-full" autoresize placeholder="Gilt **ab dem Fangtutorial** bis **vor dem Betreten der Arena in Nouvaria City**. " />
            </UFormField>
            <UFormField label="Info Belohnung" class="w-full">
              <UTextarea v-model="selectedChallenge.infoReward" class="w-full" autoresize placeholder="Arenaleiterin Viola: etc" />
            </UFormField>
          </div>
        </UCard>

        <UCard v-for="difficulty in (['easy', 'medium', 'hard'] as const)" :key="difficulty">
          <template #header>
            <h3 class="font-semibold text-lg capitalize flex items-center gap-2">
              {{ difficulty === 'easy' ? '🟢 LEICHT' : difficulty === 'medium' ? '🟡 MITTEL' : '🔴 SCHWER' }}
            </h3>
          </template>
          <div class="space-y-4">
            <UFormField label="Titel" class="w-full">
              <UInput v-model="selectedChallenge[difficulty].title" class="w-full" placeholder="Die Suche im Wald" />
            </UFormField>
            <UFormField label="Text" class="w-full">
              <UTextarea v-model="selectedChallenge[difficulty].text" class="w-full" autoresize placeholder="- Finde das Item Gegengift" />
            </UFormField>
            <UFormField label="Belohnung" class="w-full">
              <UTextarea v-model="selectedChallenge[difficulty].reward" class="w-full" autoresize placeholder="Kein Item etc" />
            </UFormField>
            <UFormField label="Bild der Challenge">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    :disabled="isUploading(difficulty)"
                    class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accented file:text-default hover:file:bg-muted cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    @change="handleFileUpload(selectedChallenge[difficulty], difficulty, $event)"
                  />
                  <UIcon v-if="isUploading(difficulty)" name="i-lucide-loader-circle" class="animate-spin text-lg shrink-0" />
                </div>
                <div v-if="selectedChallenge[difficulty].fileKey" class="flex items-center gap-3">
                  <img
                    :src="imageUrl(selectedChallenge[difficulty].fileKey)"
                    alt="Preview"
                    class="max-h-32 rounded-lg border border-default"
                  />
                  <UButton
                    icon="i-lucide-x"
                    size="sm"
                    color="error"
                    variant="soft"
                    label="Entfernen"
                    @click="clearFile(selectedChallenge[difficulty])"
                  />
                </div>
              </div>
            </UFormField>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>