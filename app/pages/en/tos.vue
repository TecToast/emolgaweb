<script setup lang="ts"></script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Terms of Service"
        description="The Terms of Service of Emolga and this website."
      />
      <UPageBody>
        <h6>
          Für die deutsche Fassung, klicke
          <NuxtLink to="/en/tos" class="underline">hier</NuxtLink>.
        </h6>
        The Emolga Bot and this website are developed and maintained solely for
        my own educational purposes. It can be used for free by anyone, but I
        reserve the right to revoke access to these services at any time.
        <br />
        For any questions you can reach me at Discord (<code>{{
          MY_DISCORD_TAG
        }}</code
        >) or via email:
        <NuxtLink class="underline" href="mailto:flo@tectoast.de"
          >flo@tectoast.de</NuxtLink
        ><br />
        Last Modified February 16th 2025 (content-wise April 4th 2024)
      </UPageBody>
    </UPage>
  </UContainer>
</template>
