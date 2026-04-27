<script setup lang="ts">
import {type InitialDsbUser, useDsbStore} from '~/stores/dsb';

const store = useDsbStore();
definePageMeta({layout: 'raw'});

const isCopied = ref(false);

const copyAnswers = async () => {
  const text = store.users.map(u => {
    if (!u.answerText) return '';
    return u.answerText.split('/')[0].trim();
  }).join('\t');
  try {
    await navigator.clipboard.writeText(text);
    isCopied.value = true;
    setTimeout(() => isCopied.value = false, 2000);
  } catch (e) {
    console.error('Failed to copy answers', e);
  }
}

const loadData = async () => {
  const data = await $fetch<{ users: InitialDsbUser[], categories: string[] }>("/api/emolga/dsb/data");
  store.setCategories(data.categories);
  store.setUsers(data.users);
}
onMounted(async () => {
  try {
    await loadData()
    const {data: wsData} = useEventSource("/api/emolga/dsb/sse", undefined, {autoReconnect: true})
    watch(wsData, (valStr) => {
      if(valStr == "heartbeat") return;
      const val = JSON.parse(valStr);
      store.submitAnswer(val.userId, val.text, val.url)
    });
  } catch (error) {
    console.error(error)
    await navigateTo("/")
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-8">
    <div class="w-full max-w-8xl space-y-8">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-center flex-1">Doppelt schmerzt besser - Control</h1>
        <UButton
            to="/dsbpresentation" target="_blank" icon="i-heroicons-arrow-top-right-on-square" color="neutral"
            variant="ghost">Open Presentation
        </UButton>
      </div>

      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-center">General Controls</h2>
            <div class="flex gap-2">
              <UButton
                  v-if="store.answerHistory.length > 0" size="sm" color="neutral" variant="ghost"
                  icon="i-heroicons-trash" @click="store.clearAnswerHistory()">Clear Cache
                ({{ store.answerHistory.length }})
              </UButton>
              <UButton
                  size="sm" color="neutral" variant="ghost" icon="i-heroicons-arrow-path"
                  @click="loadData()">Refetch Data
              </UButton>
            </div>
          </div>
        </template>

        <div class="flex flex-col gap-4 text-left">
          <div class="text-lg text-gray-500 font-semibold text-center mb-2">
            Current: {{ store.category }} ({{ store.categoryIndex + 1 }} / {{ store.categories.length }})
          </div>

          <div class="flex flex-wrap justify-between gap-4 w-full mt-4">
            <div class="flex gap-2 flex-1">
              <UButton
                  class="flex-1 justify-center" :color="store.isCategoryRevealed ? 'neutral' : 'success'"
                  @click="store.toggleCategoryReveal()">
                {{ store.isCategoryRevealed ? 'Hide Category' : 'Reveal Category' }}
              </UButton>
            </div>

            <div class="flex gap-2 flex-1 justify-end">
              <div class="flex">
                <UButton
                    color="warning" variant="soft" icon="i-heroicons-arrow-left"  :disabled="store.categoryIndex === 0"
                    class="rounded-r-none border-r border-warning-500/20" @click="store.prevQuestion(false)"/>
                <UButton
                    color="warning" variant="soft" icon="i-heroicons-arrow-right"
                    :disabled="store.categoryIndex >= store.categories.length - 1"
                    class="rounded-l-none" @click="store.nextQuestion(false)"/>
              </div>

              <UButton
                  :color="isCopied ? 'success' : 'primary'" variant="soft" class="ml-2 font-bold"
                  :icon="isCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
                  @click="copyAnswers">
                {{ isCopied ? 'Copied!' : 'Copy answers' }}
              </UButton>

              <UButton
                  color="primary" class="ml-2 font-bold" :disabled="store.categoryIndex >= store.categories.length - 1"
                  @click="store.nextQuestion(true)">
                Reset Answers & Next
              </UButton>
            </div>
          </div>

          <div v-if="store.answerHistory.length > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <details class="group">
              <summary
                  class="text-sm font-semibold text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none">
                View Answer History Cache ({{ store.answerHistory.length }} items)
              </summary>
              <div class="mt-3 flex flex-wrap gap-2">
                <UBadge v-for="(ans, idx) in store.answerHistory" :key="idx" color="neutral" variant="soft">
                  {{ ans }}
                </UBadge>
              </div>
            </details>
          </div>
        </div>
      </UCard>

      <div class="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <UCard v-for="user in store.users" :key="user.id" :class="{ 'opacity-50 grayscale': !user.isActive }">
          <template #header>
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <UAvatar :src="user.avatar" :alt="user.name"/>
                <span class="font-bold">{{ user.name }}</span>
              </div>
              <USwitch :model-value="user.isActive" @update:model-value="store.togglePlayerActive(user.id)"/>
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <div class="text-sm text-gray-500 mb-1">Answer Status:</div>
              <UBadge :color="user.answerText ? 'success' : 'error'">
                {{ user.answerText ? 'Submitted' : 'Pending' }}
              </UBadge>

              <UBadge v-if="store.isDuplicateAnswer(user.id)" color="error" variant="outline" class="ml-2 font-bold">
                <UIcon name="i-heroicons-exclamation-triangle" class="mr-1"/>
                DUPLICATE
              </UBadge>

              <div
                  v-if="user.answerText"
                  class="mt-2 text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-24 overflow-y-auto"
                  :class="{'border border-red-500 bg-red-50 dark:bg-red-900/20' : store.isDuplicateAnswer(user.id)}">
                <span class="font-semibold text-gray-400">Text:</span>
                <div class="break-words">{{ user.answerText }}</div>
              </div>

              <div v-if="user.answerImage" class="mt-1 text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                <span class="font-semibold text-gray-400 mb-1 block">Image attached:</span>
                <img :src="user.answerImage" class="w-full h-16 object-contain scale-150 rounded"/>
              </div>
            </div>

            <div>
              <UButton
                  size="sm" :color="user.isAnswerRevealed ? 'neutral' : 'primary'"
                  :disabled="!user.answerText" @click="store.toggleReveal(user.id)">
                {{ user.isAnswerRevealed ? 'Unreveal Answer' : 'Reveal Answer' }}
              </UButton>
            </div>

            <div>
              <div class="text-sm text-gray-500 mb-1">Answer Marking:</div>
              <div class="flex gap-2">
                <UButton
                    size="sm" :color="user.answerMark === 'correct' ? 'success' : 'neutral'"
                    :variant="user.answerMark === 'correct' ? 'solid' : 'soft'" icon="i-heroicons-check"
                    :disabled="!user.answerText"
                    @click="store.setAnswerMark(user.id, user.answerMark === 'correct' ? null : 'correct')"/>
                <UButton
                    size="sm" :color="user.answerMark === 'incorrect' ? 'error' : 'neutral'"
                    :variant="user.answerMark === 'incorrect' ? 'solid' : 'soft'" icon="i-heroicons-x-mark"
                    :disabled="!user.answerText"
                    @click="store.setAnswerMark(user.id, user.answerMark === 'incorrect' ? null : 'incorrect')"/>
              </div>
            </div>

            <div>
              <div class="text-sm text-gray-500 mb-1">Lives ({{ user.lives }}):</div>
              <div class="flex items-center gap-2 mt-1">
                <UButton
                    size="xs" color="neutral" icon="i-heroicons-minus"
                    @click="store.setLives(user.id, Math.max(0, user.lives - 1))"/>
                <span class="font-mono text-lg w-8 text-center">{{ user.lives }}</span>
                <UButton
                    size="xs" color="neutral" icon="i-heroicons-plus"
                    @click="store.setLives(user.id, Math.min(3, user.lives + 1))"/>
              </div>
            </div>

            <DevOnly>
              <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
                <UButton
                    size="2xs" color="info" variant="outline"
                    class="w-full justify-center"
                    @click="store.submitAnswer(user.id, 'This is a sample text answer which might be long.')">
                  Dev: Simulate Submission
                </UButton>
              </div>
            </DevOnly>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>