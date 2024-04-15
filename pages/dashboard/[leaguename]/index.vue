<script setup lang="ts">
const route = useRoute()
const leaguename = route.params.leaguename
</script>

<template>
<h2>Hello from league {{leaguename}}</h2>
  <NuxtLink :to="'/dashboard/' + Date.now().toString()">heyo</NuxtLink>
</template>

<style scoped>

</style>
