<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const guilds: Ref<GuildMeta[]> = inject("guilds", ref([]));
const selectedGuild: Ref<GuildMeta | null> = inject("selectedGuild", ref(null));
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
        color="info"
        variant="subtle"
        title="Hey! Diese Übersichtsseite ist noch im Aufbau, nutze bis zur Fertigstellung bitte die Seitenleiste."
      />
    </template>
  </UDashboardPanel>
</template>
