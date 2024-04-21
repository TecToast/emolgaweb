<script setup lang="ts">
const route = useRoute()
const leaguename = route.params.leaguename
</script>

<template>
  <div>
    <h2>Hello from league {{ leaguename }}</h2>
    <NuxtLink :to="'/dashboard/' + Date.now().toString()">heyo</NuxtLink>
  </div>
</template>

<style scoped>

</style>
