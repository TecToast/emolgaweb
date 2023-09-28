<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()
const leaguename = route.params.leaguename
</script>

<template>
  <h1>GuMo Henny :3</h1>
  <h1>Wie gehts dir so in {{leaguename}}</h1>
</template>
