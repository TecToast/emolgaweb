<script setup lang="ts"></script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Privacy Policy"
        description="The Privacy Policy of Emolga and this website."
      />
      <UPageBody class="space-y-1">
        <h6>
          Für die deutsche Fassung, klicke
          <NuxtLink to="/de/privacy" class="underline">hier</NuxtLink>.
        </h6>
        <br />
        <h3 class="text-2xl">
          The Emolga Bot and this website are storing only the following data
          (at most):
        </h3>
        <ul class="ml-6 list-disc">
          <li>Server IDs</li>
          <li>Channel IDs</li>
          <li>Member IDs</li>
          <li>
            Member names (but only for mentioning them without a ping or on this
            website when you are logged in [this may be the case in the future])
          </li>
          <li>
            Member avatar urls [only in the future and only to provide your
            profile icon here]
          </li>
          <li>Role IDs</li>
          <li>
            The "Pokémon Showdown!" account name (but only if you are
            specifically providing it to the bot)
          </li>
        </ul>
        <br />
        <p>
          This website is hosted by Cloudflare, which may collect information.
          More information can be found in their
          <NuxtLink
            to="https://www.cloudflare.com/application/privacypolicy/"
            class="underline"
            >Application Privacy Policy</NuxtLink
          >.
        </p>
        <br />
        <h3 class="text-3xl text-gray-200 mt-4 mb-2">
          How is this data being used?
        </h3>
        This data is being used to provide the bot's features. There is no
        transfer of the data to anyone else.<br />
        <br />
        If you want any data to be deleted, you can reach me at Discord (<code
          >{{ MY_DISCORD_TAG }}</code
        >) or via email:
        <NuxtLink to="mailto:flo@tectoast.de" class="underline"
          >flo@tectoast.de</NuxtLink
        ><br />
        Last Modified: February 16th 2025 (content-wise April 4th 2024)
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<style scoped></style>
