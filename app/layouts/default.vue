<script lang="ts" setup>
const headerLinks = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Einladungslink",
    to: "https://discord.com/api/oauth2/authorize?client_id=723829878755164202&permissions=3072&scope=bot",
  },
];
const footerLinks = [
  {
    label: "Terms of Service",
    to: "/de/tos",
  },
  {
    label: "Privacy Policy",
    to: "/de/privacy",
  },
];
const dropdownItems = [
  {
    label: "Logout",
    icon: "i-lucide-log-out",
    to: "/api/logout",
    external: true,
  },
];

const { user } = useUserSession();
</script>

<template>
  <UHeader>
    <template #title>
      <!-- <NuxtLink to="/"> -->
      <div class="flex items-center gap-2">
        <img src="/images/emolga.webp" class="h-16" />
        <h1>Emolga</h1>
      </div>
      <!-- </NuxtLink> -->
    </template>
    <UNavigationMenu :items="headerLinks" />
    <template #body>
      <UNavigationMenu
        :items="headerLinks"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
    <template #right>
      <UDropdownMenu v-if="user" :items="dropdownItems">
        <UButton
          :avatar="{ src: buildAvatarURLFromUser(user) }"
          :label="user.name"
          variant="subtle"
          color="neutral"
        ></UButton>
      </UDropdownMenu>
      <UButton
        v-else
        label="Login"
        icon="i-simple-icons-discord"
        color="neutral"
        variant="subtle"
        to="/api/login"
        :external="true"
        aria-label="Einladungslink"
      />
    </template>
  </UHeader>
  <UMain>
    <slot />
  </UMain>
  <USeparator />
  <UFooter>
    <template #left>
      <p class="text-(--ui-text-muted) text-sm">
        Copyright © {{ new Date().getFullYear() }}
      </p>
    </template>

    <UNavigationMenu :items="footerLinks" variant="link" />

    <template #right>
      <UButton
        icon="i-simple-icons-discord"
        color="neutral"
        variant="ghost"
        to="https://discord.gg/WYfKHPCgs9"
        target="_blank"
        aria-label="Discord"
      />
      <UButton
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        to="https://github.com/TecToast/Emolga"
        target="_blank"
        aria-label="GitHub"
      />
    </template>
  </UFooter>
</template>
