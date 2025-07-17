<script lang="ts" setup>
import type { ResultCodeResponse } from "~/utils/types";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const resultid = route.params.resultid;
const { data, error } = await useFetch<ResultCodeResponse>(
  `/api/emolga/result/${resultid}`
);
type PlayerData = { [mon: string]: { k: number; d: boolean } };
type ResultData = Record<string, PlayerData>;

const resultData = ref<ResultData>({});

function togglePokemonSelection(playerName: string, pokemon: string) {
  if (!resultData.value[playerName]) {
    resultData.value[playerName] = {};
  }
  const playerData = resultData.value[playerName];
  if (playerData[pokemon]) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete playerData[pokemon];
  } else {
    playerData[pokemon] = { k: 0, d: false };
  }
}

const validResult = computed(() => {
  const data = resultData.value;
  const keys = Object.keys(data);
  if (keys.length != 2) return false;
  return [0, 1].every((i) => {
    const playerData: PlayerData = data[keys[i] as string]!;
    const opponentData: PlayerData = data[keys[1 - i] as string]!;
    return (
      Object.values(playerData).reduce((sum, mon) => sum + mon.k, 0) ==
      Object.values(opponentData).reduce((sum, mon) => sum + (mon.d ? 1 : 0), 0)
    );
  });
});
const modalDescription = computed(() => {
  if (!validResult.value) {
    return "Die Ergebnisse scheinen nicht korrekt zu sein. Bitte überprüfe die Eingaben.";
  }
  return (
    "Bist du sicher, dass du die Ergebnisse so eingeben möchtest?\n\n" +
    Object.entries(resultData.value)
      .map(
        ([player, mons]) =>
          `${player}:\n${Object.entries(mons)
            .map(([mon, data]) => `${mon} ${data.k} ${data.d ? "X" : ""}`)
            .join("\n")}`
      )
      .join("\n\n")
  );
});

function sendResult() {
  const fetchedData = data.value;
  if (!validResult.value || !fetchedData) return;
  const payload = fetchedData.data.map((itm) => resultData.value[itm.name]!);
  $fetch(`/api/emolga/result/${resultid}`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
    .then(() => {
      toast.add({
        title: "Ergebnisse erfolgreich eingereicht!",
        color: "success",
      });
      router.push("/");
    })
    .catch((error) => {
      toast.add({
        title: "Fehler beim Einreichen der Ergebnisse!",
        description: error.message || "Unbekannter Fehler",
        color: "error",
      });
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
        :disabled="!validResult"
        :on-confirm="sendResult"
      />
      <p>
        Klicke alle Pokémon an, die in diesem Kampf verwendet wurden, und stelle
        dann jeweils die Kills und Deaths ein. Wenn du fertig bist, klicke auf
        den Bestätigen-Button.
      </p>
    </div>
    <div class="flex w-full justify-around">
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
            <div class="flex flex-col gap-2">
              <template v-for="mon of pdata.picks" :key="mon.german">
                <div class="w-full flex items-center gap-4">
                  <div
                    class="flex items-center gap-2"
                    :class="
                      resultData[pdata.name]?.[mon.german]
                        ? 'visible'
                        : 'invisible'
                    "
                  >
                    <p class="text-sm">Kills</p>
                    <UInputNumber
                      :default-value="0"
                      :min="0"
                      :max="6"
                      :model-value="
                        resultData[pdata.name]?.[mon.german]?.k ?? 0
                      "
                      @update:model-value="(value) => resultData[pdata.name]![mon.german]!.k = value"
                    />
                  </div>
                  <div
                    class="rounded-lg ring ring-default p-2 flex gap-2 items-center cursor-pointer w-full"
                    :class="{
                      'bg-primary-900': resultData[pdata.name]?.[mon.german],
                    }"
                    @click="togglePokemonSelection(pdata.name, mon.german)"
                  >
                    <img
                      :src="`https://play.pokemonshowdown.com/sprites/gen5/${mon.english
                        .toLowerCase()
                        .replace(' ', '')}.png`"
                    />
                    <p>{{ mon.german }}</p>
                  </div>
                  <UCheckbox
                    :class="
                      resultData[pdata.name]?.[mon.german]
                        ? 'visible'
                        : 'invisible'
                    "
                    size="xl"
                    label="Besiegt?"
                    :model-value="
                      resultData[pdata.name]?.[mon.german]?.d ?? false
                    "
                    @update:model-value="(value) => resultData[pdata.name]![mon.german]!.d = !!value"
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
