<script setup lang="ts">
const { fetchIfRequired } = useUserSession()

await fetchIfRequired()
</script>

<template>
  <NuxtLoadingIndicator />
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
