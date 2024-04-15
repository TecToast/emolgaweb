<script setup lang="ts">
import type {Avatar} from "#ui/types";
type League = {
  id: string
  label: string
  avatar: Avatar
}
const leagues = [{
  id: 'asl',
  label: 'ASL',
  avatar: {src: 'https://cdn.discordapp.com/icons/518008523653775366/2f9ba8f68d7b468f5945c54fcb61c46a.png'}
}]
const options = [{
  href: 'queuepicks',
  label: 'Picks queuen',
  icon: 'ph-queue'
},{
  href: 'dragtest',
  label: 'Dragtest',
  icon: 'radix-icons-crosshair-2'
}]
const selected = ref(leagues[0])
</script>

<template>
  <div>
    <div class="fixed top-0 min-h-full w-72 bg-[#24303F] z-50">
      <div class="flex flex-col items-center">
        <h1 class="text-3xl text-center mt-5 font-sans">Dashboard</h1>
        <USelectMenu :options="leagues" v-model="selected" size="xl" class="w-64 mx-2 mt-5">
          <template #leading>
            <UAvatar v-if="selected" v-bind="(selected.avatar as Avatar)" size="xs"/>
          </template>
        </USelectMenu>
        <div class="flex flex-col items-start mt-5 gap-4 text-lg w-52">
          <ULink active-class="bg-gray-900" class="rounded-md py-1 px-3" v-for="item in options" :to="`/dashboard/${selected.id}/${item.href}`">
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
        <NuxtPage/>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
