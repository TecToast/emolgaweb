<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const guilds: Ref<GuildMeta[]> = inject("guilds", ref([]));
const selectedGuild = useRoute().params.guild as string;
</script>

<template>
  <UDashboardPanel id="guild">
    <template #header>
      <UDashboardNavbar
        :title="`Server | ${guilds.find((g) => g.id == selectedGuild)?.name}`"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <h1>GuMo!</h1>
    </template>
  </UDashboardPanel>
</template>
