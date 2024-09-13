<script setup lang="ts">
import type {ExtendedLeague, League} from "~/utils/types";



definePageMeta({
  middleware: 'auth'
})
const discord = useDiscordStore();
const {leagues: leagueData} = storeToRefs(discord)
if (leagueData.value == null) {
  await discord.loadLeagues()
}

const leagues = computed<ExtendedLeague[]>(() => {
  const parsed = leagueData.value ?? []
  if(parsed.length == 0) {
    return [{name: 'Keine Liga verfügbar', picks: [], isRunning: false, logoUrl: '', valid: false}]
  }
  return parsed.map((league: League) => ({...league, valid: true}))
})
const options = [{
  href: 'queuepicks',
  label: 'Picks queuen',
  icon: 'ph-queue'
}]
const selected = ref<ExtendedLeague>(leagues.value[0])
</script>

<template>
  <div>
    <div class="fixed top-0 min-h-full w-72 bg-[#24303F] z-50">
      <div class="flex flex-col items-center">
        <h1 class="text-3xl text-center mt-5 font-sans">Dashboard</h1>
        <USelectMenu :options="leagues" v-model="selected" :disabled="!selected.valid" option-attribute="name" size="xl" class="w-64 mx-2 mt-5">
          <template #leading>
            <UAvatar v-if="selected.valid" v-bind="{src: selected.logoUrl}" size="xs"/>
          </template>
        </USelectMenu>
        <div class="flex flex-col items-start mt-5 gap-4 text-lg w-52" v-if="selected.valid">
          <ULink active-class="bg-gray-900" class="rounded-md py-1 px-3" v-for="item in options"
                 :to="`/dashboard/${selected.name}/${item.href}`">
            <div class="flex justify-start items-center gap-3">
              <UIcon :name="`i-${item.icon}`" dynamic/>
              <span>{{ item.label }}</span>
            </div>
          </ULink>
        </div>
      </div>
    </div>
    <div class="ml-72">
      <div class="ml-2 mt-2">
        <NuxtPage :selected="selected"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
