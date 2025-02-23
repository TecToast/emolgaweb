<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  keepalive: true,
});
const guilds: Ref<GuildMeta[]> = inject("guilds", ref([]));
const options = computed(() => {
  return guilds.value?.map((guild) => ({
    id: guild.id,
    label: guild.name,
    avatar: { src: guild.icon },
    to: `/dashboard/${guild.id}`,
  }));
});
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <h1>Bitte wähle einen Server aus:</h1>
      <UPageList class="gap-4">
        <UPageCard
          v-for="option in options"
          :key="option.id"
          variant="subtle"
          :to="option.to"
        >
          <template #body>
            <UUser
              :name="option.label"
              :avatar="option.avatar"
              size="xl"
              class="relative"
            />
          </template>
        </UPageCard>
      </UPageList>
      <UAlert
        color="info"
        variant="subtle"
        title="Server nicht dabei?"
        icon="i-lucide-info"
      >
        <template #description>
          Aus Datenschutzgründen fragt Emolga bei der Anmeldung nicht nach allen
          Servern, denen du beigetreten bist. Wenn du einen Server vermisst,
          kannst du ihn über <code>/dashboard</code> auf dem jeweiligen Server
          hinzufügen. [Work in Progress]
        </template>
      </UAlert>
    </template>
  </UDashboardPanel>
</template>
