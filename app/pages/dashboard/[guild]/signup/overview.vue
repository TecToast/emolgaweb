<script lang="ts" setup>
import type {TableColumn} from "#ui/components/Table.vue";
import {UUser} from "#components";

definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const {data: participantsStored} = await useFetch(
    `/api/emolga/${route.params.guild}/signup/participants`
);
type TableParticipant = {
  user: {
    avatar: string;
    name: string;
  },
  logo: string;
  sdname?: string;
  teamname?: string;
}
const participants: Ref<TableParticipant[]> = computed(() => {
  const data = participantsStored.value?.data;
  if (!data) return [];
  return data.map((u) => ({
    user: {
      avatar: u.users[0]!.avatar,
      name: u.users[0]!.name,
    },
    logo: u.hasLogo ? '✅' : '❌',
    ...u.data
  }))
})
const columns: Ref<TableColumn<TableParticipant>[]> = computed(() => {
  const firstParticipant = participants.value[0];
  return ([
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({row}) => {
        const u = row.getValue<TableParticipant['user']>('user');
        return h(UUser, {
          name: u.name,
          avatar: {src: u.avatar},
        })
      }
    },
    {
      accessorKey: 'logo',
      header: 'Logo',
    },
    ...(firstParticipant?.sdname ? [{
      accessorKey: 'sdname',
      header: 'SD Name',
    }] : []),
    ...(firstParticipant?.teamname ? [{
      accessorKey: 'teamname',
      header: 'Team Name',
    }] : []),
  ]);
});
</script>

<template>
  <UDashboardPanel
      id="participantsoverview"
  >
    <template #header>
      <UDashboardNavbar :title="`Teilnehmerübersicht`" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse/>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>

      <UAlert
          v-if="participantsStored === undefined"
          class="m-8 w-auto"
          title="Auf diesem Server gibt es aktuell keine Anmeldung."
          variant="subtle"
      />
      <template v-else>
        <UAlert
            :title="`Anzahl: ${participantsStored.data.length}`"
            color="neutral"
            variant="subtle"
        />
        <UTable :data="participants" :columns="columns" class="flex-1"/>
      </template>
    </template>
  </UDashboardPanel>
</template>
