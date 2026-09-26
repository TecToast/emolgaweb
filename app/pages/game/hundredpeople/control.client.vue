<script setup lang="ts">
import { useHundredPeopleStore } from '~/stores/hundredpeople'

const store = useHundredPeopleStore()

const session = useUserSession()
await session.fetchIfRequired()
if(!session.user.value) {
  throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
}

definePageMeta({ layout: 'raw' })
</script>

<template>
  <div class="min-h-screen bg-slate-950 p-6 text-white">
    <div class="mx-auto max-w-7xl space-y-6">
      <div class="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.28em] text-cyan-400">Game control</p>
          </div>

          <UButton
            to="/game/hundredpeople/presentation"
            target="_blank"
            color="primary"
            variant="solid"
            icon="i-heroicons-arrow-top-right-on-square"
          >
            Open presentation
          </UButton>
        </div>

        <div class="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-cyan-300">Current topic</p>
              <p class="mt-2 text-xl font-semibold text-slate-100">{{ store.topic }}</p>
            </div>

            <UButton
              :color="store.showTopic ? 'neutral' : 'success'"
              size="sm"
              @click="store.toggleTopicVisibility()"
            >
              {{ store.showTopic ? 'Hide topic' : 'Show topic' }}
            </UButton>
          </div>

          <div class="mt-4 flex items-center justify-between gap-3 border-t border-cyan-500/20 pt-4">
            <UButton
              color="neutral"
              variant="soft"
              icon="i-heroicons-chevron-left"
              :disabled="store.currentDataIndex <= 0"
              @click="store.previousData()"
            >
              Previous
            </UButton>
            <span class="text-sm text-cyan-200">
              Question {{ store.currentDataIndex + 1 }} / {{ store.allData.length }}
            </span>
            <UButton
              color="neutral"
              variant="soft"
              trailing-icon="i-heroicons-chevron-right"
              :disabled="store.currentDataIndex >= store.allData.length - 1"
              @click="store.nextData()"
            >
              Next
            </UButton>
          </div>
        </div>

      </div>

      <div class="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div class="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-bold">Top answers</h2>
            <UBadge color="primary" variant="soft">{{ store.sortedAnswers.length }} entries</UBadge>
          </div>

          <div class="space-y-3">
            <div
              v-for="(answer, index) in store.sortedAnswers"
              :key="answer.id"
              class="rounded-2xl border border-slate-700 bg-slate-800 p-3"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 flex-1 items-center gap-3">
                  <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
                    #{{ index + 1 }}
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate text-base font-semibold text-slate-100">{{ answer.text }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <UBadge color="success" variant="solid" class="min-w-16 justify-center">
                    {{ answer.points }}%
                  </UBadge>
                </div>
              </div>

              <div class="mt-3 flex items-center justify-between gap-3">
                <UButton
                  :color="answer.revealed ? 'neutral' : 'success'"
                  size="sm"
                  @click="store.toggleAnswerReveal(answer.id)"
                >
                  {{ answer.revealed ? 'Hide answer' : 'Reveal answer' }}
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 class="mb-4 text-xl font-bold">Teams</h2>

          <div class="space-y-3">
            <div v-for="player in store.players" :key="player.id" class="rounded-2xl border border-slate-700 bg-slate-800/70 p-3">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="relative h-24 w-24 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                    <img
                      v-for="(member, memberIndex) in player.members.slice(0, 2)"
                      :key="member.id"
                      :src="member.avatar"
                      :alt="member.name"
                      class="absolute inset-y-0 h-full object-cover"
                      :class="player.members.length === 1 ? 'left-0 w-full' : memberIndex === 0 ? 'left-0 w-1/2' : 'right-0 w-1/2'"
                    />
                    <img
                      v-if="player.members.length > 2"
                      :src="player.members[2]?.avatar ?? ''"
                      :alt="player.members[2]?.name ?? 'Team member'"
                      class="absolute bottom-0 left-1/2 h-1/2 w-1/2 -translate-x-1/2 rounded-t-full border border-slate-700 object-cover"
                    />
                  </div>
                </div>
                <div class="rounded-xl bg-cyan-500/15 px-3 py-2 text-center">
                  <span class="block text-[10px] uppercase tracking-[0.2em] text-cyan-300">Score</span>
                  <span class="text-xl font-black text-cyan-200">{{ player.points }}</span>
                </div>
              </div>

              <div class="mt-3 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2">
                <span class="text-sm font-medium text-slate-200">Correct</span>
                <USwitch :model-value="player.correct" @update:model-value="store.toggleTeamCorrect(player.id)" />
              </div>

              <div class="mt-3 flex items-center gap-2">
                <UButton size="xs" color="neutral" variant="soft" icon="i-heroicons-minus" @click="store.setPlayerPoints(player.id, player.points - 1)" />
                <UInput :model-value="String(player.points)" type="number" size="xs" class="w-20" @update:model-value="(value: string | number | null) => store.setPlayerPoints(player.id, Number(value) || 0)" />
                <UButton size="xs" color="neutral" variant="soft" icon="i-heroicons-plus" @click="store.setPlayerPoints(player.id, player.points + 1)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
