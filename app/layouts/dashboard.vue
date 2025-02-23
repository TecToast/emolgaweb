<script setup lang="ts">
import type { NavigationMenuItem } from "#ui/types";
const route = useRoute();

const { data: guilds } = await useFetch<GuildMeta[]>("/api/emolga/guilds");
const selectedGuild: Ref<GuildMeta | null> = computed(
  () =>
    guilds.value?.find((g) => g.id === route.params.guild) as GuildMeta | null
);

provide("guilds", guilds);
provide("selectedGuild", selectedGuild);

const generalLinks = [
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
  ],
  [
    {
      label: "Support-Server",
      icon: "i-lucide-message-circle",
      to: DISCORD_SERVER_INVITE_URL,
      target: "_blank",
    },
  ],
];
const linksInServer: Ref<NavigationMenuItem[]> = computed(() => {
  const guild = selectedGuild.value;
  if (!guild) return [];
  const links: NavigationMenuItem[] = [
    {
      label: guild.name,
      avatar: { src: guild.icon },
      to: `/dashboard/${guild.id}`,
    },
    {
      label: "Anmeldung",
      icon: "i-lucide-user-plus",
      children: [
        {
          label: "Konfiguration",
          to: `/dashboard/${guild.id}/signup/config`,
          icon: "i-lucide-settings",
        },
        {
          label: "Teilnehmereinteilung",
          to: `/dashboard/${guild.id}/signup/participants`,
          icon: "i-lucide-users",
        },
      ],
    },
  ];
  return links;
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
          :items="generalLinks[0]"
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
          :items="generalLinks[1]"
          orientation="vertical"
          class="mt-auto"
        />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
