<script setup lang="ts">

const guild = useRoute().params.guild as string;
const { data, error } = await useFetch<{ name: string; spriteName: string; amount: number }[]>(
  `/api/emolga/picked/${guild}?v=1`
);

const maxAmount = computed(() => {
  if (!data.value?.length) return 1;
  return Math.max(...data.value.map((p) => p.amount));
});
</script>

<template>
  <div class="min-h-screen bg-default p-8">
    <div class="max-w-3xl mx-auto flex flex-col gap-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold">Picked Pokémon</h1>
        <p v-if="data" class="text-dimmed mt-1">
          {{ data.length }} Pokémon in total
        </p>
      </div>

      <UAlert
        v-if="error"
        title="Fehler beim Laden der Daten"
        description="Bitte versuche es später noch einmal."
        color="error"
        variant="subtle"
        icon="i-lucide-alert-circle"
      />

      <div v-if="data && data.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-inbox" class="text-5xl text-dimmed" />
        <p class="text-dimmed mt-2">No Pokémon picked</p>
      </div>

      <div v-else-if="data" class="flex flex-col gap-3">
        <UCard
          v-for="(pokemon, index) in data"
          :key="pokemon.name"
        >
          <div class="flex items-center gap-4">
            <UBadge
              :label="`#${index + 1}`"
              variant="subtle"
              color="neutral"
              size="lg"
              class="font-mono min-w-10 justify-center"
            />
            <img
              :src="`https://play.pokemonshowdown.com/sprites/gen5/${pokemon.spriteName}.png`"
              :alt="pokemon.name"
              class="size-12 object-contain"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="font-semibold text-lg truncate">{{ pokemon.name }}</span>
                <UBadge
                  :label="`${pokemon.amount}×`"
                  color="primary"
                  variant="subtle"
                  size="md"
                />
              </div>
              <UProgress
                :model-value="(pokemon.amount / maxAmount) * 100"
                color="primary"
                size="sm"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

