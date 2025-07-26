<script lang="ts" setup>
import type { UsageDataTotal } from "~/utils/types";

const league = useRoute().params.league as string;
const router = useRouter();
const gameday = ref<number | undefined>(undefined);
const { data, error } = await useFetch<UsageDataTotal>(
  () => `/api/emolga/usage/${league}`,
  {
    query: {
      gameday,
    },
  }
);

function switchToLeague(newLeague: string) {
  if (newLeague !== league) {
    router.replace(`/usage/${newLeague}`);
  }
}

const currentGameday = computed(() => {
  return gameday.value ?? data.value?.maxGameday ?? 1;
});
</script>

<template>
  <div>
    <UAlert
      v-if="error"
      title="Fehler beim Laden der Daten"
      :description="`Wenn du denkst, dass der Fehler nicht bei dir liegt, melde dich bitte bei ${MY_DISCORD_TAG}.`"
      color="error"
      variant="subtle"
      class="w-1/2"
    />
    <div v-if="data" class="flex flex-col items-center mt-4">
      <div class="flex justify-between w-full">
        <div class="w-1/3">
          <UTabs
            :items="
              data.allLeagues.map((l) => ({
                label: l,
                value: l,
              }))
            "
            class="w-full ml-4"
            :model-value="league"
            @update:model-value="itm => switchToLeague(itm as string)"
          />
        </div>
        <h1 class="text-2xl font-bold">
          Usage Data für {{ league }} ({{ data.total }} Kämpfe)
        </h1>
        <div class="flex flex-col gap-2 items-center w-1/3">
          <span class="text-sm">Bis Spieltag:</span>
          <UInputNumber
            :model-value="currentGameday"
            :min="1"
            :max="data.maxGameday"
            @update:model-value="(value) => (gameday = value)"
          />
        </div>
      </div>
      <div class="my-4 flex flex-col items-center gap-2">
        <div
          v-for="mon of data.data"
          :key="mon.mon"
          class="rounded-lg ring ring-default p-2"
        >
          {{ mon.mon }} - {{ mon.count }}
        </div>
      </div>
    </div>
  </div>
</template>
