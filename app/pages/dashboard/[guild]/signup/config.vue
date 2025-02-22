<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
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
      <UnderConstruction />
    </template>
  </UDashboardPanel>
</template>
