<script setup lang="ts">
import type {ExtendedLeague} from "~/utils/types";

const selected = useAttrs().selected as ExtendedLeague

</script>

<template>
  <div>Hello there :) {{selected.valid}}</div>
</template>

<style scoped>
</style>
