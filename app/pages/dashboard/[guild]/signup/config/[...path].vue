<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const configState = useConfigState();
await callOnce("configFetch", async () => {
  await configState.signupFetch();
});
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
        :structure="configState.signupData!.structure"
        :initial-content="configState.signupData!.content"
      />
    </template>
  </UDashboardPanel>
</template>
