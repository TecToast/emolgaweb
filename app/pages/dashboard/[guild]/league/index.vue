<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const selectedGuild: Ref<GuildMeta | null> = inject("selectedGuild", ref(null));
const { data: options } = await useFetch<string[]>(
  `/api/emolga/${selectedGuild.value?.id}/leagues`
);
</script>

<template>
  <UDashboardPanel id="guild">
    <template #header>
      <UDashboardNavbar
        :title="`Server | ${selectedGuild?.name}`"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #trailing>
          <UAvatar v-if="selectedGuild" :src="selectedGuild.icon" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UAlert
          v-if="!options?.length"
          color="info"
          variant="subtle"
          title="Aktuell gibt es auf diesem Server keine Emolga-Ligen."
      />
      <UPageList v-else class="gap-4">
        <UPageCard
          v-for="option in options"
          :key="option"
          variant="subtle"
          :to="`/dashboard/${selectedGuild?.id}/league/${option}`"
        >
          <template #body>
            {{ option }}
          </template>
        </UPageCard>
      </UPageList>
    </template>
  </UDashboardPanel>
</template>
