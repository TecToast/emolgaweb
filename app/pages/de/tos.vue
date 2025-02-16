<script setup lang="ts"></script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Allgemeine Geschäftsbedingungen"
        description="Die AGBs von Emolga und dieser Website."
      />
      <UPageBody>
        <h6>
          For the english version, click
          <NuxtLink to="/en/tos" class="underline">here</NuxtLink>.
        </h6>
        Der Emolga-Bot und diese Website werden ausschließlich zu meinen eigenen
        Bildungszwecken entwickelt und gewartet. Sie können von jedem kostenlos
        genutzt werden, aber ich behalte mir das Recht vor, den Zugriff auf
        diese Dienste jederzeit zu widerrufen.
        <br />
        Bei jeglichen Fragen erreichen Sie mich auf Discord (<code>{{
          MY_DISCORD_TAG
        }}</code
        >) oder per E-Mail:
        <NuxtLink to="mailto:flo@tectoast.de" class="underline"
          >flo@tectoast.de</NuxtLink
        ><br />
        Zuletzt geändert: 16.02.2025 (inhaltlich 04.04.2024)
      </UPageBody>
    </UPage>
  </UContainer>
</template>
