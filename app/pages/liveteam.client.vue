<script setup lang="ts">
definePageMeta({layout: 'raw'})
const route = useRoute()
const {token} = route.query
const curNum = ref(0)

function createPath(num: number) {
  return `/api/emolga/liveteam?token=${token}&num=${num}`
}

const path = computed(() => {
  return createPath(curNum.value)
})
const cache: { [num: number]: HTMLImageElement } = {}
watch(curNum, (newVal) => {
  if (newVal < 0) {
    curNum.value = 0
  }
  const nextNum = newVal + 1
  if (!cache[nextNum]) {
    const img = new Image()
    img.src = createPath(newVal + 1)
    cache[nextNum] = img
  }
  if (newVal > 10) {
    delete cache[newVal - 10]
  }
}, { immediate: true })
</script>

<template>
  <Transition name="stack" mode="in-out">
    <img :key="curNum" :src="path" alt="Teamgraphic" @click.left="curNum++" @contextmenu.prevent="curNum--"/>
  </Transition>
</template>

<style scoped>
img {
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