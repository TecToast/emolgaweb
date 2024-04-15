<template>
  <div class="flex flex-col" style="min-height: 100vh">
    <Header/>
    <div class="mx-2 xl:mx-0 h-[calc(100vh-6.5rem)] overflow-scroll">
      <NuxtPage/>
    </div>
    <Footer/>
  </div>
</template>
<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'bg-[#1A222C]',
    //style: "cursor: url('/emolga.png'), auto;"
  }
})
</script>
