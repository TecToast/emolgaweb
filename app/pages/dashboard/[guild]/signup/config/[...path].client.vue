<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const configState = useConfigState();
const { guild } = useRoute().params;
const { data, fetch } = configState.getConfig(
  `/api/emolga/${guild}/signup/config`
);
await callOnce("configFetch", async () => {
  await fetch();
});
const router = useRouter();
</script>

<template>
  <UDashboardPanel id="signup">
    <template #header>
      <UDashboardNavbar :title="`Anmeldungskonfiguration`">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <EmolgaConfig
        v-if="data"
        :data="data"
        :on-submit="() => router.push('/dashboard/' + guild)"
      />
    </template>
  </UDashboardPanel>
</template>
