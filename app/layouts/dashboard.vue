<script setup lang="ts">
const route = useRoute();
const toast = useToast();

const {
  data: guilds,
  status,
  error,
} = await useFetch<GuildMeta[]>("/api/emolga/guilds");
const selectedGuild: Ref<GuildMeta | null> = computed(
  () =>
    guilds.value?.find((g) => g.id === route.params.guild) as GuildMeta | null
);

provide("guilds", guilds);
provide("selectedGuild", selectedGuild);

const links = [
  [
    {
      label: "Startseite",
      icon: "i-lucide-home",
      to: "/",
    },
    {
      label: "Serverübersicht",
      icon: "i-simple-icons-discord",
      to: "/dashboard",
    },
    /* {
      label: "Inbox",
      icon: "i-lucide-inbox",
      to: "/inbox",
      badge: "4",
    },
    {
      label: "Customers",
      icon: "i-lucide-users",
      to: "/customers",
    },
    {
      label: "Settings",
      to: "/settings",
      icon: "i-lucide-settings",
      defaultOpen: true,
      children: [
        {
          label: "General",
          to: "/settings",
          exact: true,
        },
        {
          label: "Members",
          to: "/settings/members",
        },
        {
          label: "Notifications",
          to: "/settings/notifications",
        },
      ],
    },*/
  ],
  [
    {
      label: "Feedback",
      icon: "i-lucide-message-circle",
      to: "https://github.com/nuxt-ui-pro/dashboard",
      target: "_blank",
    },
    {
      label: "Help & Support",
      icon: "i-lucide-info",
      to: "https://github.com/nuxt/ui-pro",
      target: "_blank",
    },
  ],
];
const linksInServer = computed(() => {
  const guild = selectedGuild.value;
  if (!guild) return [];
  return [
    {
      label: "Anmeldung",
      icon: "i-lucide-user-plus",
      to: `/dashboard/${guild.id}/signup`,
    },
    {
      label: "Draft",
      icon: "i-lucide-clipboard",
      to: `/dashboard/${guild.id}/draft`,
    },
    {
      label: "Tippspiel",
      icon: "i-lucide-trophy",
      to: `/dashboard/${guild.id}/tipgame`,
    },
    {
      label: "Einstellungen",
      icon: "i-lucide-settings",
      to: `/dashboard/${guild.id}/einstellungen`,
    },
  ];
});
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
      class="bg-(--ui-bg-elevated)/25"
      :ui="{ footer: 'lg:border-t lg:border-(--ui-border)' }"
    >
      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
        />
        <USeparator />
        <UNavigationMenu
          :collapsed="collapsed"
          :items="linksInServer"
          orientation="vertical"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          class="mt-auto"
        />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
