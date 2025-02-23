<script lang="ts" setup>
import draggable from "vuedraggable";
definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const toast = useToast();
const { data: participantsStored } = await useFetch(
  `/api/emolga/${route.params.guild}/signup/participants`
);
const uncategorized = ref<ParticipantData[]>([]);
const conferences = ref<{ [conf: string]: ParticipantData[] }>({});
function deleteConference(conf: string) {
  conferences.value[conf]?.forEach((p) => uncategorized.value.push(p));
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete conferences.value[conf];
}
watch(
  participantsStored,
  (data) => {
    if (data === undefined) return;
    data.conferences.forEach((conf: string) => {
      conferences.value[conf] = [];
    });
    data.data.forEach((p: ParticipantData) => {
      const conf = p.conference;
      if (!conf) {
        uncategorized.value.push(p);
      } else {
        conferences.value[conf]!.push(p);
      }
    });
  },
  { immediate: true }
);
function dataToDescription(pData: ParticipantData) {
  return Object.entries(pData.data)
    .filter(([key]) => key.includes("_"))
    .map(([key, value]) => `${key.substring(key.indexOf("_") + 1)}: ${value}`)
    .join(", ");
}
async function saveToServer() {
  const data: (string | null)[][] = [];
  for (const [conf, participants] of Object.entries(conferences.value)) {
    participants.forEach((p) => {
      data.push([p.users[0]!.id, conf]);
    });
  }
  uncategorized.value.forEach((p) => {
    data.push([p.users[0]!.id, null]);
  });
  await $fetch(`/api/emolga/${route.params.guild}/signup/participants`, {
    method: "POST",
    body: {
      conferences: Object.keys(conferences.value),
      data: Object.fromEntries(data),
    },
  });
  toast.add({
    title: "Verteilung gespeichert!",
    color: "success",
  });
}
</script>

<template>
  <UDashboardPanel
    id="participants1"
    :default-size="25"
    :min-size="20"
    :max-size="30"
    resizable
  >
    <template #header>
      <UDashboardNavbar :title="`Teilnehmer`" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPageList class="gap-2 hidden lg:block">
        <template v-if="Object.keys(conferences).length !== 0">
          <div
            v-for="conf of Object.keys(conferences)"
            :key="conf"
            class="flex justify-between items-center rounded-2xl bg-neutral-800 p-4"
          >
            <div>{{ conf }}</div>
            <ConfirmModal
              :title="`Conference '${conf}' löschen`"
              description="Möchtest du diese Conference wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden."
              confirm-label="Ja"
              cancel-label="Nein"
              btn-color="error"
              btn-icon="i-lucide-trash"
              @confirm="deleteConference(conf)"
            />
          </div>
        </template>
        <UAlert v-else title="Keine Conferences vorhanden" variant="subtle" />
      </UPageList>
      <SignupConferenceModal
        class="hidden lg:inline-flex"
        @new="(name) => (conferences[name] = [])"
      />
      <UButton
        class="hidden lg:inline-flex"
        label="Verteilung speichern"
        icon="i-lucide-save"
        color="success"
        :disabled="participantsStored === undefined"
        @click="saveToServer"
      />
      <UAlert
        color="error"
        variant="subtle"
        title="Diese Seite ist aufgrund ihrer benötigten Größe nur für große Bildschirme verfügbar."
        class="block lg:hidden"
      />
    </template>
  </UDashboardPanel>
  <UDashboardPanel
    id="participants2"
    :default-size="10"
    :min-size="5"
    :max-size="15"
    resizable
  >
    <UAlert
      v-if="participantsStored === undefined"
      class="m-8 w-auto"
      title="Auf diesem Server gibt es aktuell keine Anmeldung."
      variant="subtle"
    />
    <template v-else>
      <UAlert
        :title="`Zu verteilen: ${uncategorized.length}`"
        color="neutral"
        variant="subtle"
      />
      <draggable
        tag="ul"
        :list="uncategorized"
        group="participants"
        :item-key="(item: any) => item.users[0].id"
        class="flex flex-col mt-2 gap-2 overflow-auto"
      >
        <template #item="{ element }">
          <div class="mx-2">
            <UUser
              :name="element.users[0].name"
              :description="dataToDescription(element)"
              :avatar="{ src: element.users[0].avatar }"
            />
          </div>
        </template>
      </draggable>
    </template>
  </UDashboardPanel>
  <UDashboardPanel>
    <UAlert
      v-if="Object.keys(conferences).length === 0"
      variant="subtle"
      title="Keine Conferences vorhanden, füge links eine hinzu."
      class="m-4 w-auto"
    />
    <div v-else class="grid grid-cols-3 gap-x-4 gap-y-8 m-4">
      <div v-for="cdata of Object.entries(conferences)" :key="cdata[0]">
        <UAlert
          :title="cdata[0]"
          color="neutral"
          variant="subtle"
          class="mb-2"
        />
        <draggable
          tag="ul"
          group="participants"
          :list="cdata[1]"
          :item-key="(item: any) => item.users[0].id"
          class="flex flex-col gap-1 overflow-auto"
        >
          <template #item="{ element }">
            <div>
              <UUser
                :name="element.users[0].name"
                :description="dataToDescription(element)"
                :avatar="{ src: element.users[0].avatar }"
              />
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </UDashboardPanel>
</template>
