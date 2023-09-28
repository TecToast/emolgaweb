<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from "./components/Footer.vue";
import {RouterView} from "vue-router";
import {useAuthState} from "./state/auth.ts";
import {onMounted} from "vue";
import {initFlowbite} from "flowbite";

const auth = useAuthState()

onMounted(() => {
  initFlowbite()
})
</script>

<template>
  <div style="min-height: calc(100vh - 2.5rem)">
    <Header class="min-h-16"/>

    <RouterView v-if="auth.loaded" />
    <div v-else class="grid place-content-center h-48">
      <PulseLoader size="30px"></PulseLoader>
    </div>
  </div>
  <Footer class="h-10 relative clear-both"></Footer>
</template>
