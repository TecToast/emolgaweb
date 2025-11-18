<script lang="ts" setup>
const props = defineProps<{
  keyVal: string;
  index: number;
  userTable: { name: string; avatar: string }[] | null;
}>();
</script>

<template>
  <div v-if="props.userTable === null">{{ keyVal }}</div>
  <UUser
    v-else
    :name="props.userTable[props.index]!.name"
    :avatar="{src: props.userTable[props.index]!.avatar}"
    class="w-16"
  />
</template>
