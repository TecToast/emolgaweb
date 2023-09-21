<script setup lang="ts">

import {MY_DISCORD_TAG} from "../helpers/constants.ts";
</script>

<template>
  <div class="text-left text-gray-400 mx-auto max-w-6xl my-10 text-lg">
    <h1 class="font-bold text-gray-200 text-4xl mb-5">
      Privacy Policy
    </h1>
    <h3 class="text-3xl text-gray-200">The Emolga Bot and this website are storing only the following data (at most):</h3>
    <br>
    <ul class="list-disc">
      <li>Server ID</li>
      <li>Channel IDs</li>
      <li>Member IDs</li>
      <li>Member names (but only for mentioning them without a ping or on this website when you are logged in [this may be the case in the future])</li>
      <li>Member avatar urls [only in the future and only to provide your profile icon here]</li>
      <li>Role IDs</li>
      <li>The "Pokémon Showdown!" account name (but only if you are specifically providing it to the bot)</li>
    </ul>
    <br>
    <h3 class="text-3xl text-gray-200 mt-4 mb-2">How is this data being used?</h3>
    This data is being used to provide the bot's features. There is no transfer of the data to anyone else.<br>
    <br>
    If you want any data to be deleted, you can reach me at Discord (<code>{{ MY_DISCORD_TAG }}</code>) or via email: <a href="mailto:flo@tectoast.de">flo@tectoast.de</a><br>
    Last Modified June 19th 2023
  </div>
</template>

<style scoped>

</style>
