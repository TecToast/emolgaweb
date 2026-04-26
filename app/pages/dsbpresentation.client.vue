<script setup lang="ts">
import {useDsbStore} from '~/stores/dsb';

const store = useDsbStore();

definePageMeta({layout: 'raw'});
</script>

<template>
  <div
      v-if="store.categories.length"
      class="h-screen w-screen bg-gray-900 text-white overflow-hidden flex flex-col relative">
    <div
        v-if="store.category && store.isCategoryRevealed"
        class="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 border-4 border-gray-700 text-4xl font-bold py-4 px-16 rounded-2xl shadow-2xl text-center tracking-wide">
      {{ store.category }}
    </div>
    <div class="mt-auto pb-10 px-10 flex justify-between gap-6">
      <template v-for="user in store.users" :key="user.id">
        <div
            v-if="user.isActive"
            class="flex-1 flex flex-col items-center gap-4 bg-gray-800 p-6 rounded-2xl border-4 border-gray-700 shadow-2xl relative"
            :class="{'ring-4 ring-green-500 border-green-500' : user.answerMark === 'correct', 'ring-4 ring-red-500 border-red-500' : user.answerMark === 'incorrect'}">
          <div
              class="w-full h-48 bg-gray-900 border-gray-600 rounded-lg flex flex-col items-center justify-center overflow-hidden border-2 relative">
            <template v-if="user.isAnswerRevealed">
              <img
                  v-if="user.answerImage" :src="user.answerImage" class="w-full h-full object-contain scale-150"
                  :alt="user.answerText"/>
              <div v-else-if="user.answerText" class="text-3xl font-bold p-4 whitespace-normal text-center">
                {{ user.answerText }}
              </div>
              <span v-else class="text-gray-500 italic text-xl">No answer</span>
            </template>
            <template v-else>
              <UIcon name="i-heroicons-question-mark-circle" class="w-20 h-20 text-gray-500"/>
            </template>
          </div>
          <div class="flex items-center gap-4 w-full justify-center">
            <img :src="user.avatar" class="w-16 h-16 rounded-full" alt="img"/>
            <div class="text-2xl font-bold">{{ user.name }}</div>
          </div>
          <div class="flex gap-2 mt-2">
            <UIcon
                v-for="i in 3" :key="i"
                :name="i <= user.lives ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
                :class="['w-10 h-10', i <= user.lives ? 'text-red-500' : 'text-gray-600']"/>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>