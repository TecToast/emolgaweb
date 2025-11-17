<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const configState = useConfigState();
const { guild, leaguename } = useRoute().params;
const { data, fetch } = configState.getConfig(
  `/api/emolga/${guild}/league/${leaguename}/delta`
);
await callOnce("configFetch", async () => {
  await fetch();
  console.log("data", data.value);
});
</script>

<template>
  <UDashboardPanel id="signup">
    <template #header>
      <UDashboardNavbar :title="`Liga bearbeiten`">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <EmolgaConfig v-if="data" :data="data" :on-submit="() => {}" />
    </template>
  </UDashboardPanel>
</template>
