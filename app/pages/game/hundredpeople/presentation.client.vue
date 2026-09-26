<script setup lang="ts">
import { useHundredPeopleStore } from '~/stores/hundredpeople'

const store = useHundredPeopleStore()

definePageMeta({ layout: 'raw' })
</script>

<template>
  <div class="min-h-screen overflow-hidden bg-slate-950 text-white">
    <div class="mx-auto flex min-h-screen max-w-7xl flex-col p-6">
      <header class="py-3 text-center h-40">
        <p class="text-xs uppercase tracking-[0.35em] text-cyan-400">Ich habe ungefähr 50 Leute gefragt</p>
        <h1 class="mt-3 text-4xl font-black text-white whitespace-pre-line md:text-5xl">{{ store.showTopic ? store.topic : ':)' }}</h1>
      </header>

      <main class="mt-6 flex flex-1 flex-col gap-6">
        <section class="mx-auto w-1/2 space-y-3">
          <div
            v-for="(answer, index) in store.sortedAnswers"
            :key="answer.id"
            class="rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-lg shadow-slate-950/40"
          >
            <div class="flex items-center gap-3">
              <span class="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
                #{{ index + 1 }}
              </span>
                <template v-if="answer.revealed">
                  <div class="flex items-center justify-between gap-3 h-4">
                    <p class="text-lg font-semibold text-slate-100">{{ answer.text }}</p>
                    <UBadge color="success" variant="solid" class="text-[12px]">
                      {{ answer.points }}%
                    </UBadge>
                  </div>
                </template>
                <template v-else>
                  <div class="h-4" />
                </template>
            </div>
          </div>
        </section>

        <section class="mt-2 flex-1">

          <div class="grid gap-4 grid-cols-5">
            <div
              v-for="player in store.players"
              :key="player.id"
              class="flex flex-col gap-4 items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-lg shadow-slate-950/40"
              :class="player.correct ? 'border-emerald-400 ring-4 ring-emerald-400/40 shadow-emerald-950/50' : ''"
            >
              <div class="flex items-center gap-4">
                <div class="relative h-48 w-48 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
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

              <div class="rounded-xl bg-cyan-500/15 px-4 py-3 text-center">
                <div class="text-3xl font-black text-cyan-200">{{ player.points }}</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>
