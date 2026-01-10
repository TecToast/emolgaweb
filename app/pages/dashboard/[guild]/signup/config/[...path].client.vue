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
const toast = useToast();

function onSubmit() {
  toast.add({title: "Anmeldung eröffnet!", color: 'success'});
  router.push("/dashboard/" + guild);
}
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
        :on-submit="onSubmit"
      />
    </template>
  </UDashboardPanel>
</template>
