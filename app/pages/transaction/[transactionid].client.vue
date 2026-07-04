<script setup lang="ts">
import type { TransactionData } from "~/utils/types";

const route = useRoute();
const toast = useToast();
const transactionid = route.params.transactionid as string;

const { data, error, status } = useFetch<TransactionData>(
  `/api/emolga/transaction/${transactionid}`
);
const displayNames = computed(() => {
  const dataValue = data.value;
  if (!dataValue) return {};
  return dataValue.displayNames
})
const selectedDrops = ref<Set<string>>(new Set());
const selectedPicks = ref<Set<string>>(new Set());
const selectedTera = ref<Set<string>>(
  new Set()
);
watchOnce(data, (val) => {
  if (!val) return;
  selectedTera.value = new Set(
    val.picked.filter((p) => p.tera).map((p) => p.showdownId)
  );
});
const submitting = ref(false);

const searchQuery = ref("");

const currentPicked = computed(() => data.value?.picked ?? []);
const availablePokemon = computed(() => data.value?.available ?? []);
const requiredTeraCount = computed(() => data.value?.teraCount ?? 2);

const filteredAvailable = computed(() => {
  const q = searchQuery.value.toLowerCase().trim().replaceAll(/[^a-zA-Z\\d]/g, '');
  if(q.length <= 2) return [];
  return availablePokemon.value.filter(
    (p) =>
      p.showdownId.includes(q)
  );
});

const futureTeam = computed(() => {
  const kept = currentPicked.value.filter(
    (p) => !selectedDrops.value.has(p.showdownId)
  );
  const added = availablePokemon.value.filter((p) =>
    selectedPicks.value.has(p.showdownId)
  );
  return [...kept, ...added];
});

const teraMaxPoints = computed(() => data.value?.teraMaxPoints);
const monMaxPoints = computed(() => data.value?.monMaxPoints);

const monPointsSum = computed(() => {
  if (monMaxPoints.value == null) return 0;
  return futureTeam.value.reduce((sum, p) => {
    const tier = selectedTera.value.has(p.showdownId) && p.teraTier ? p.teraTier : p.tier;
    return sum + Number(tier);
  }, 0);
});

const monPointsValid = computed(() =>
  monMaxPoints.value == null || monPointsSum.value <= monMaxPoints.value
);

function wouldExceedMonPoints(showdownId: string) {
  if (monMaxPoints.value == null) return false;
  if (selectedPicks.value.has(showdownId)) return false;
  const pokemon = availablePokemon.value.find((p) => p.showdownId === showdownId);
  if (!pokemon) return false;
  const cost = Number(pokemon.tier);
  return monPointsSum.value + cost > monMaxPoints.value;
}

const teraPointsSum = computed(() => {
  if (teraMaxPoints.value == null) return 0;
  return futureTeam.value
    .filter((p) => selectedTera.value.has(p.showdownId))
    .reduce((sum, p) => sum + Number(p.teraTier ?? p.tier), 0);
});

function wouldExceedTeraPoints(showdownId: string) {
  if (teraMaxPoints.value == null) return false;
  if (selectedTera.value.has(showdownId)) return false;
  const pokemon = futureTeam.value.find((p) => p.showdownId === showdownId);
  if (!pokemon) return false;
  return teraPointsSum.value + Number(pokemon.teraTier ?? pokemon.tier) > teraMaxPoints.value;
}

function wouldExceedTransactionPoints(showdownId: string) {
  if (selectedTera.value.has(showdownId)) return false;
  if (initialTera.value.has(showdownId)) return false;
  // Check if this new tera would be offset by a dropped tera
  const currentNewTera = newTeraCount.value;
  // Adding this would increase newTeraCount by 1 only if not already offset
  const wouldBeNewCount = (() => {
    let count = 0;
    for (const n of selectedTera.value) {
      if (!initialTera.value.has(n)) count++;
    }
    count++; // the one we're about to add
    return Math.max(0, count - droppedTeraCount.value);
  })();
  const additionalCost = wouldBeNewCount - currentNewTera;
  return remainingPoints.value - additionalCost < 0;
}

const isBalanced = computed(
  () => selectedDrops.value.size === selectedPicks.value.size
);

const teraValid = computed(
  () => selectedTera.value.size === requiredTeraCount.value
);

const initialTera = computed(() =>
  new Set(data.value?.picked.filter((p) => p.tera).map((p) => p.showdownId) ?? [])
);

const droppedTeraCount = computed(() =>
  currentPicked.value.filter(
    (p) => p.tera && selectedDrops.value.has(p.showdownId)
  ).length
);

const newTeraCount = computed(() => {
  let count = 0;
  for (const showdownId of selectedTera.value) {
    if (!initialTera.value.has(showdownId)) count++;
  }
  return Math.max(0, count - droppedTeraCount.value);
});

const switchCost = computed(() => selectedDrops.value.size);

const totalCost = computed(() => switchCost.value + newTeraCount.value);

const remainingPoints = computed(
  () => (data.value?.transactionPoints ?? 0) - totalCost.value
);

const canAfford = computed(() => remainingPoints.value >= 0);

const teraChanged = computed(() => {
  if (selectedTera.value.size !== initialTera.value.size) return true;
  for (const showdownId of selectedTera.value) {
    if (!initialTera.value.has(showdownId)) return true;
  }
  return false;
});

const canSubmit = computed(
  () =>
    isBalanced.value &&
    teraValid.value &&
    canAfford.value &&
    monPointsValid.value &&
    (selectedDrops.value.size > 0 || teraChanged.value) &&
    !submitting.value
);

function toggleDrop(showdownId: string) {
  const s = new Set(selectedDrops.value);
  if (s.has(showdownId)) {
    s.delete(showdownId);
  } else {
    s.add(showdownId);
  }
  selectedDrops.value = s;
  nextTick(() => cleanupTera());
}

function togglePick(showdownId: string) {
  const s = new Set(selectedPicks.value);
  if (s.has(showdownId)) {
    s.delete(showdownId);
  } else {
    s.add(showdownId);
  }
  selectedPicks.value = s;
  nextTick(() => cleanupTera());
}

function toggleTera(showdownId: string) {
  const s = new Set(selectedTera.value);
  if (s.has(showdownId)) {
    s.delete(showdownId);
  } else {
    if (s.size >= requiredTeraCount.value) {
      toast.add({
        title: "Tera Limit Reached",
        description: `You can only select ${requiredTeraCount.value} Pokémon as Tera.`,
        color: "warning",
      });
      return;
    }
    s.add(showdownId);
  }
  selectedTera.value = s;
}

function cleanupTera() {
  const futureShowdownIds = new Set(futureTeam.value.map((p) => p.showdownId));
  const s = new Set(selectedTera.value);
  // Remove tera selections for pokemon no longer in future team
  for (const showdownId of s) {
    if (!futureShowdownIds.has(showdownId)) {
      s.delete(showdownId);
    }
  }
  // Restore original tera users that are back in the future team
  for (const showdownId of initialTera.value) {
    if (futureShowdownIds.has(showdownId) && !s.has(showdownId)) {
      s.add(showdownId);
    }
  }
  selectedTera.value = s;
}

async function submit() {
  submitting.value = true;
  try {
    await $fetch(`/api/emolga/transaction/${transactionid}`, {
      method: "POST",
      body: {
        drops: [...selectedDrops.value],
        picks: [...selectedPicks.value],
        teraUsers: [...selectedTera.value],
      },
    });
    toast.add({
      title: "Transaction Successful!",
      description: "Your changes have been saved.",
      color: "success",
    });
    await navigateTo("/")
  } catch (e: any) {
    toast.add({
      title: "Error",
      description:
        e?.data?.message ?? "An error occurred while saving.",
      color: "error",
    });
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-default p-4 md:p-8">
    <div class="max-w-6xl mx-auto flex flex-col gap-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold">Pokémon Transaction</h1>
        <p class="text-dimmed mt-1">
          Here you can drop and pick up any Pokémon you want to as long as it is within the rules/available. Once your transaction is submitted the link expires and you have to ask for a new link.
        </p>
      </div>

      <UAlert
        v-if="error"
        title="Error loading data"
        description="Please try again later."
        color="error"
        variant="subtle"
        icon="i-lucide-alert-circle"
      />

      <div v-if="status === 'pending' || status === 'idle'" class="flex flex-col items-center justify-center py-24 gap-4">
        <UIcon name="i-lucide-loader-circle" class="text-5xl text-primary animate-spin" />
        <p class="text-dimmed">Loading transaction data...</p>
      </div>

      <template v-else-if="data">
        <!-- Status summary -->
        <div class="flex flex-wrap gap-3 justify-center">
          <UBadge
            :color="isBalanced ? 'success' : 'warning'"
            variant="subtle"
            size="lg"
          >
            <UIcon
              :name="
                isBalanced
                  ? 'i-lucide-check-circle'
                  : 'i-lucide-alert-triangle'
              "
              class="mr-1"
            />
            {{ selectedDrops.size }} dropped / {{ selectedPicks.size }}
            picked up
          </UBadge>
          <UBadge
            :color="teraValid ? 'success' : 'warning'"
            variant="subtle"
            size="lg"
          >
            <UIcon
              :name="
                teraValid
                  ? 'i-lucide-check-circle'
                  : 'i-lucide-alert-triangle'
              "
              class="mr-1"
            />
            Tera: {{ selectedTera.size }} / {{ requiredTeraCount }}
          </UBadge>
          <UBadge
            v-if="teraMaxPoints != null"
            :color="teraPointsSum <= teraMaxPoints ? 'success' : 'error'"
            variant="subtle"
            size="lg"
          >
            <UIcon
              :name="teraPointsSum <= teraMaxPoints ? 'i-lucide-check-circle' : 'i-lucide-alert-triangle'"
              class="mr-1"
            />
            Remaining Tera Points: {{ teraMaxPoints - teraPointsSum }} / {{ teraMaxPoints }}
          </UBadge>
          <UBadge
            v-if="monMaxPoints != null"
            :color="monPointsValid ? 'success' : 'error'"
            variant="subtle"
            size="lg"
          >
            <UIcon
              :name="monPointsValid ? 'i-lucide-check-circle' : 'i-lucide-alert-triangle'"
              class="mr-1"
            />
            Remaining Points: {{ monMaxPoints - monPointsSum }} / {{ monMaxPoints }}
          </UBadge>
          <UBadge
            :color="canAfford ? 'success' : 'error'"
            variant="subtle"
            size="lg"
          >
            <UIcon
              :name="canAfford ? 'i-lucide-check-circle' : 'i-lucide-alert-triangle'"
              class="mr-1"
            />
            Remaining Transactions: {{ remainingPoints }} / {{ data.transactionPoints }}
            <span class="ml-1 text-xs opacity-70">
              ({{ switchCost }} switch{{ switchCost !== 1 ? 'es' : '' }}<template v-if="newTeraCount > 0"> + {{ newTeraCount }} tera</template>)
            </span>
          </UBadge>
        </div>

        <!-- Grid: Drops / Picks -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <!-- Current team (drop selection) -->
          <div>
            <h2 class="text-xl font-semibold mb-3 flex items-center gap-2">
              <UIcon name="i-lucide-arrow-down-circle" class="text-red-500" />
              Your Current Team
            </h2>
            <p class="text-sm text-dimmed mb-3">
              Click on any Pokémon you want to drop.
            </p>
            <div class="flex flex-col gap-2">
              <UCard
                v-for="pokemon in currentPicked"
                :key="pokemon.showdownId"
                :class="[
                  'cursor-pointer transition-all',
                  selectedDrops.has(pokemon.showdownId)
                    ? 'ring-2 ring-red-500 opacity-60'
                    : 'hover:ring-2 hover:ring-red-300',
                ]"
                @click="toggleDrop(pokemon.showdownId)"
              >
                <div class="flex items-center gap-3">
                  <UCheckbox
                    :model-value="selectedDrops.has(pokemon.showdownId)"
                    color="error"
                    @click.stop
                    @change="toggleDrop(pokemon.showdownId)"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <span class="font-semibold truncate">{{
                        displayNames[pokemon.showdownId]
                      }}</span>
                      <UBadge variant="subtle" :color="pokemon.tera ? 'info' : 'neutral'" size="sm">
                        {{ pokemon.tera ? pokemon.teraTier : pokemon.tier }}
                      </UBadge>
                    </div>
                  </div>
                  <UIcon
                    v-if="selectedDrops.has(pokemon.showdownId)"
                    name="i-lucide-x-circle"
                    class="text-red-500 text-lg shrink-0"
                  />
                </div>
              </UCard>
            </div>
          </div>

          <!-- Available pokemon (pick selection) -->
          <div>
            <h2 class="text-xl font-semibold mb-3 flex items-center gap-2">
              <UIcon
                name="i-lucide-arrow-up-circle"
                class="text-green-500"
              />
              Available Pokémon
            </h2>
            <p class="text-sm text-dimmed mb-3">
              Click on any available Pokémon you would like to pick up
            </p>

            <UInput
              v-model="searchQuery"
              placeholder="Search Pokémon..."
              icon="i-lucide-search"
              class="mb-3"
            />

            <div class="flex flex-col gap-2 max-h-[600px] overflow-y-auto p-2 -m-2">
              <UAlert v-if="!filteredAvailable.length" title="Please type in at least 3 characters" variant="subtle" />
              <UCard
                v-for="pokemon in filteredAvailable"
                v-else
                :key="pokemon.showdownId"
                :class="[
                  'transition-all',
                  'shrink-0',
                  pokemon.picked || wouldExceedMonPoints(pokemon.showdownId)
                    ? 'opacity-40 cursor-not-allowed'
                    : selectedPicks.has(pokemon.showdownId)
                      ? 'cursor-pointer ring-2 ring-green-500'
                      : 'cursor-pointer hover:ring-2 hover:ring-green-300',
                ]"
                @click="!pokemon.picked && !wouldExceedMonPoints(pokemon.showdownId) && togglePick(pokemon.showdownId)"
              >
                <div class="flex items-center gap-3">
                  <UCheckbox
                    :model-value="selectedPicks.has(pokemon.showdownId)"
                    :disabled="!!pokemon.picked || wouldExceedMonPoints(pokemon.showdownId)"
                    color="success"
                    @click.stop
                    @change="togglePick(pokemon.showdownId)"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span
                          class="font-semibold truncate"
                          :class="{
                            'line-through': pokemon.picked,
                          }"
                        >
                          {{ displayNames[pokemon.showdownId] }}
                        </span>
                        <UBadge
                          v-if="pokemon.picked"
                          variant="subtle"
                          color="error"
                          size="xs"
                        >
                          Already picked
                        </UBadge>
                      </div>
                      <div class="flex gap-1.5">
                        <UBadge variant="subtle" :color="pokemon.tera ? 'info' : 'neutral'" size="sm">
                          {{ pokemon.tera ? pokemon.teraTier : pokemon.tier }}
                        </UBadge>
                      </div>
                    </div>
                  </div>
                  <UIcon
                    v-if="selectedPicks.has(pokemon.showdownId)"
                    name="i-lucide-check-circle"
                    class="text-green-500 text-lg shrink-0"
                  />
                </div>
              </UCard>
            </div>
          </div>
        </div>

        <!-- Future team preview with tera selection -->
        <div v-if="futureTeam.length > 0">
          <h2 class="text-xl font-semibold mb-3 flex items-center gap-2">
            <UIcon name="i-lucide-eye" class="text-purple-500" />
            Future Team & Tera Selection
            <UBadge variant="subtle" :color="teraValid ? 'success' : 'warning'" size="sm">
              Tera: {{ selectedTera.size }} / {{ requiredTeraCount }}
            </UBadge>
            <UBadge
              v-if="teraMaxPoints != null"
              variant="subtle"
              :color="teraPointsSum <= teraMaxPoints ? 'success' : 'error'"
              size="sm"
            >
              Remaining Tera Points: {{ teraMaxPoints - teraPointsSum }} / {{ teraMaxPoints }}
            </UBadge>
          </h2>
          <p class="text-sm text-dimmed mb-3">
            Select exactly {{requiredTeraCount}} Pokémon as your Tera-Captains. The checkbox is only enabled if the Pokémon is an eligible Tera-Captain.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <UCard
              v-for="pokemon in futureTeam"
              :key="pokemon.showdownId"
            >
              <div class="flex items-center gap-3">
                <UIcon
                  :name="
                    selectedPicks.has(pokemon.showdownId)
                      ? 'i-lucide-plus-circle'
                      : 'i-lucide-circle'
                  "
                  :class="
                    selectedPicks.has(pokemon.showdownId)
                      ? 'text-green-500'
                      : 'text-dimmed'
                  "
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="font-semibold truncate">{{
                      displayNames[pokemon.showdownId]
                    }}</span>
                    <UBadge
                      variant="subtle"
                      :color="selectedTera.has(pokemon.showdownId) ? 'info' : 'neutral'"
                      size="sm"
                    >
                      {{ selectedTera.has(pokemon.showdownId) && pokemon.teraTier ? pokemon.teraTier : pokemon.tier }}
                    </UBadge>
                  </div>
                </div>
                <UCheckbox
                  :model-value="selectedTera.has(pokemon.showdownId)"
                  :disabled="!pokemon.teraTier || (teraValid && !selectedTera.has(pokemon.showdownId)) || wouldExceedTeraPoints(pokemon.showdownId) || wouldExceedTransactionPoints(pokemon.showdownId)"
                  color="info"
                  @click.stop
                  @change="toggleTera(pokemon.showdownId)"
                />
              </div>
            </UCard>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-center">
          <UButton
            size="xl"
            :disabled="!canSubmit"
            :loading="submitting"
            icon="i-lucide-send"
            @click="submit"
          >
            Submit Transaction
          </UButton>
        </div>

        <!-- Validation hints -->
        <div
          v-if="!canSubmit && (selectedDrops.size > 0 || selectedPicks.size > 0)"
          class="flex flex-col gap-2 items-center"
        >
          <UAlert
            v-if="!isBalanced"
            title="Unbalanced Transaction"
            :description="`You are dropping ${selectedDrops.size} Pokémon but picking up ${selectedPicks.size}. The numbers must be equal.`"
            color="warning"
            variant="subtle"
            icon="i-lucide-alert-triangle"
            class="max-w-lg w-full"
          />
          <UAlert
            v-if="!teraValid && isBalanced"
            title="Tera Selection Incomplete"
            :description="`You must select exactly ${requiredTeraCount} Tera Pokémon (currently: ${selectedTera.size}).`"
            color="warning"
            variant="subtle"
            icon="i-lucide-alert-triangle"
            class="max-w-lg w-full"
          />
          <UAlert
            v-if="!canAfford"
            title="Not Enough Points"
            :description="`This transaction costs ${totalCost} point${totalCost !== 1 ? 's' : ''} (${switchCost} switch${switchCost !== 1 ? 'es' : ''}${newTeraCount > 0 ? ` + ${newTeraCount} new tera` : ''}), but you only have ${data?.transactionPoints ?? 0} remaining.`"
            color="error"
            variant="subtle"
            icon="i-lucide-alert-triangle"
            class="max-w-lg w-full"
          />
          <UAlert
            v-if="!monPointsValid"
            title="Team Points Exceeded"
            :description="`Your future team costs ${monPointsSum} points, but the maximum is ${monMaxPoints}.`"
            color="error"
            variant="subtle"
            icon="i-lucide-alert-triangle"
            class="max-w-lg w-full"
          />
        </div>
      </template>
    </div>
  </div>
</template>
