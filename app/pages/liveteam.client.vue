<script setup lang="ts">
definePageMeta({layout: 'raw'})
const route = useRoute()
const {token} = route.query
const curNum = ref(0)

function createPath(num: number) {
  return `/api/emolga/liveteam?token=${token}&num=${num}`
}
const backgroundPath = createPath(-1)

const path = computed(() => {
  return createPath(curNum.value)
})
const cache: { [num: number]: HTMLImageElement } = {}
const transitionMode = ref<"default" | "in-out">("in-out")
watch(curNum, (newVal, oldVal) => {
  if (newVal < 0) {
    curNum.value = 0
  }
  const modulo = newVal % 2
  const result = newVal < (oldVal ?? 0) ? 1 - modulo : modulo
  transitionMode.value = result === 0 ? "default" : "in-out"
  const nextNum = newVal + 1
  if (!cache[nextNum]) {
    const img = new Image()
    img.src = createPath(newVal + 1)
    cache[nextNum] = img
  }
  if (newVal > 10) {
    delete cache[newVal - 10]
  }
}, { immediate: true, flush: "sync" })
</script>

<template>
  <img :src="backgroundPath" alt="Background" class="base">
  <Transition name="stack" :mode="transitionMode">
    <img :key="curNum" :src="path" alt="Teamgraphic" class="team" @click.left="curNum++" @contextmenu.prevent="curNum--"/>
  </Transition>
</template>

<style scoped>
img.base {
  position: absolute;
  z-index: 0;
}
img.team {
  position: absolute;
  z-index: 1;
}
/* 1. The Entering Image (The one fading IN) */
.stack-enter-active {
  transition: opacity 0.5s ease;
  z-index: 10; /* CRITICAL: Force the new image to sit on top */
}

/* Start the new image at 0 opacity */
.stack-enter-from {
  opacity: 0;
}

/* 2. The Leaving Image (The one staying BEHIND) */
.stack-leave-active {
  /* We don't want the old image to fade out.
     We want it to stay solid until the browser removes it. */
  transition: opacity 0.1s ease;
  z-index: 0; /* Keep it behind the new one */
}
.stack-leave-to {
  opacity: 0;
}
</style>