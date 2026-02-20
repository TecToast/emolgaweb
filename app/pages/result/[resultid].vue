<script lang="ts" setup>
import type { ResultCodeResponse } from "~/utils/types";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const resultid = route.params.resultid;
const { data, error } = await useFetch<ResultCodeResponse>(
  `/api/emolga/result/${resultid}`
);
type PlayerData = { [mon: string]: { k: number; d: number } };
type ResultData = Record<string, PlayerData>;
const allResultDatas = ref<ResultData[]>([{}, {}, {}]);
const selectedGame = ref(1);
const resultData = computed(
  () => allResultDatas.value[selectedGame.value - 1]!
);
const submitting = ref(false);

function togglePokemonSelection(playerName: string, pokemon: string) {
  if (!resultData.value[playerName]) {
    resultData.value[playerName] = {};
  }
  const playerData = resultData.value[playerName];
  if (playerData[pokemon]) {
    delete playerData[pokemon];
    if (Object.keys(playerData).length === 0) {
      delete resultData.value[playerName];
    }
  } else {
    playerData[pokemon] = { k: 0, d: 0 };
  }
}

const invalidIndexes = computed(() => {
  const invalidIndexes = [];
  for (const [index, rsData] of Object.entries(allResultDatas.value)) {
    const keys = Object.keys(rsData);
    if (
      !(index == "2" && keys.length == 0) &&
      (keys.length != 2 ||
        ![0, 1].every((i) => {
          const playerData: PlayerData = rsData[keys[i] as string]!;
          const opponentData: PlayerData = rsData[keys[1 - i] as string]!;
          if(Object.keys(playerData).length > 6) return false;
          return (
            Object.values(playerData).reduce((sum, mon) => sum + mon.k, 0) ==
            Object.values(opponentData).reduce(
              (sum, mon) => sum + (mon.d ? 1 : 0),
              0
            )
          );
        }))
    ) {
      invalidIndexes.push(index);
    }
    if (!data.value?.bo3) break;
  }
  return invalidIndexes;
});
const errorMsg = computed(() => {
  if (invalidIndexes.value.length) {
    return `Die Ergebnisse ${
      data.value?.bo3
        ? `im Kampf ${invalidIndexes.value
            .map((itm) => Number.parseInt(itm) + 1)
            .join(" & ")} `
        : ""
    }scheinen nicht korrekt zu sein. Bitte überprüfe die Eingaben.`;
  }
  return null;
});
const modalDescription = computed(() => {
  const error = errorMsg.value;
  if (error) {
    return error;
  }
  return (
    "Bist du sicher, dass du die Ergebnisse so eingeben möchtest?\n\n" +
    allResultDatas.value
      .filter((rsData) => Object.keys(rsData).length > 0)
      .map((rsData) =>
        Object.entries(rsData)
          .map(
            ([player, mons]) =>
              `${player}:\n${Object.entries(mons)
                .map(([mon, data]) => `${mon} ${data.k} ${data.d ? "X" : ""}`)
                .join("\n")}`
          )
          .join("\n\n")
      )
      .join("\n\n===============\n\n")
  );
});

function sendResult() {
  const fetchedData = data.value;
  if (invalidIndexes.value.length || !fetchedData) return;
  const payloads = [];
  for (let i = 0; i < (fetchedData.bo3 ? 3 : 1); i++) {
    const resData = allResultDatas.value[i]!;
    if (Object.keys(resData).length === 0) {
      continue;
    }
    const payload = fetchedData.data.map((itm) => resData[itm.name]!);
    payloads.push(payload);
  }
  submitting.value = true;
  $fetch(`/api/emolga/result/${resultid}`, {
    method: "POST",
    body: JSON.stringify(payloads),
  })
    .then(() => {
      toast.add({
        title: "Ergebnisse erfolgreich eingereicht!",
        color: "success",
      });
      submitting.value = false;
      router.push("/");
    })
    .catch((error) => {
      toast.add({
        title: "Fehler beim Einreichen der Ergebnisse!",
        description: error.message || "Unbekannter Fehler",
        color: "error",
      });
      submitting.value = false;
    });
}
</script>

<template>
  <div v-if="error" class="flex justify-center mt-4">
    <UAlert
      title="Fehler beim Laden der Ergebniseingabe"
      :description="`Wenn du denkst, dass der Fehler nicht bei dir liegt, melde dich bitte bei ${MY_DISCORD_TAG}.`"
      color="error"
      variant="subtle"
      class="w-1/2"
    />
  </div>
  <div v-if="data" class="flex flex-col items-center my-4 gap-8">
    <div class="flex flex-col items-center gap-2">
      <img
        v-if="data.logoUrl"
        :src="data.logoUrl"
        alt="Guild Logo"
        class="w-16 h-16 rounded-full"
      />
      <h2 class="text-lg font-semibold">{{ data.guildName }}</h2>
      <h3 class="text-md">Spieltag {{ data.gameday }}</h3>
      <ConfirmModal
        title="Ergebniseingabe bestätigen"
        :description="modalDescription"
        btn-color="success"
        btn-icon="i-heroicons-check"
        btn-label="Bestätigen"
        :disabled="!!invalidIndexes.length"
        :error-msg="errorMsg"
        :on-confirm="sendResult"
        :loading-confirm="submitting"
      />
      <div v-if="data.bo3" class="my-4">
        <p class="px-2 xl:px-0 py-4">
          Wähle hier nacheinander die Kämpfe aus und trage die entsprechenden
          Daten ein. Lass den dritten Kampf leer, falls es nur zwei Kämpfe gab.
        </p>
        <UTabs
          v-model="selectedGame"
          :content="false"
          :items="
            [1, 2, 3].map((itm) => ({ label: `Kampf ${itm}`, value: itm }))
          "
        ></UTabs>
      </div>
      <p class="px-2 xl:px-0">
        Klicke alle Pokémon an, die in diesem Kampf verwendet wurden, und stelle
        dann jeweils die Kills und Deaths ein. Wenn du
        {{ data.bo3 ? "mit allen Kämpfen " : "" }}fertig bist, klicke auf den
        Bestätigen-Button.
      </p>
    </div>
    <div
      class="flex w-full flex-col xl:flex-row justify-around gap-16 xl:gap-0"
    >
      <div
        v-for="pdata of data.data"
        :key="pdata.name"
        class="flex flex-col items-center gap-4"
      >
        <div class="flex gap-2 items-center">
          <img
            :src="pdata.avatarUrl"
            alt="Player Avatar"
            class="w-8 h-8 rounded-full"
          />
          <h4 class="text-md font-semibold">{{ pdata.name }}</h4>
        </div>
        <div class="flex gap-8">
          <div class="flex gap-2 flex-col">
            <h2 class="text-lg font-semibold text-center">Kader</h2>
            <div class="flex flex-col gap-2 px-2 xl:px-0">
              <template v-for="mon of pdata.picks" :key="mon.tlName">
                <div class="w-full flex items-center gap-4">
                  <div
                    class="flex flex-col xl:flex-row items-center gap-2"
                    :class="
                      resultData[pdata.name]?.[mon.tlName]
                        ? 'visible'
                        : 'invisible'
                    "
                  >
                    <p class="text-sm">Kills</p>
                    <ClientOnly>
                      <UInputNumber
                        :default-value="0"
                        :min="0"
                        :max="6"
                        :model-value="
                          resultData[pdata.name]?.[mon.tlName]?.k ?? 0
                        "
                        @update:model-value="(value) => resultData[pdata.name]![mon.tlName]!.k = value"
                      />
                    </ClientOnly>
                  </div>
                  <div
                    class="rounded-lg ring ring-default p-2 flex flex-col xl:flex-row gap-2 items-center cursor-pointer w-full"
                    :class="{
                      'bg-primary-900': resultData[pdata.name]?.[mon.tlName],
                    }"
                    @click="togglePokemonSelection(pdata.name, mon.tlName)"
                  >
                    <img
                      :src="`https://play.pokemonshowdown.com/sprites/gen5/${mon.spriteName}.png`"
                      :alt="mon.spriteName"
                    />
                    <p>{{ mon.tlName }}</p>
                  </div>
                  <UCheckbox
                    :class="
                      resultData[pdata.name]?.[mon.tlName]
                        ? 'visible'
                        : 'invisible'
                    "
                    size="xl"
                    label="Besiegt?"
                    :model-value="resultData[pdata.name]?.[mon.tlName]?.d == 1"
                    @update:model-value="(value) => resultData[pdata.name]![mon.tlName]!.d = value ? 1 : 0"
                  />
                </div>
              </template>
            </div>
          </div>
          <!--<div class="flex flex-col gap-2">
            <h2 class="text-lg font-semibold text-center">Mitgebrachte Mons</h2>
            <div class="flex flex-col gap-2">
              <div
                v-for="mon of pdata.picks"
                :key="mon.german"
                class="bg-default rounded-lg ring ring-default p-2 flex gap-2"
              >
                <UCheckbox :label="mon.german" />
              </div>
            </div>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>
