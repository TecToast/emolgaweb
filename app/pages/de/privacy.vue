<script setup lang="ts"></script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Datenschutzerklärung"
        description="Die Datenschutzerklärung von Emolga und dieser Website."
      />
      <UPageBody class="space-y-1">
        <h6>
          For the english version, click
          <NuxtLink to="/en/privacy" class="underline">here</NuxtLink>.
        </h6>
        <br />
        <h4 class="text-2xl">
          Der Emolga-Discord-Bot und diese Website können folgende Daten
          speichern:
        </h4>

        <ul class="ml-6 list-disc">
          <li>Server-IDs</li>
          <li>Kanal-IDs</li>
          <li>Benutzer-IDs</li>
          <li>
            Benutzernamen (nur um diese ohne Ping zu erwähnen oder auf dieser
            Website zum Anzeigen)
          </li>
          <li>Benutzeravatarurls (um das Profilbild hier anzuzeigen)</li>
          <li>Rollen-IDs</li>
          <li>
            Den "Pokémon Showdown!" Account-Namen (nur wenn man ihn explizit
            angibt)
          </li>
        </ul>
        <br />
        <p>
          Diese Website wird über Cloudflare gehostet, welche eventuell Daten
          erheben können. Mehr Informationen können in deren
          <NuxtLink
            to="https://www.cloudflare.com/de-de/application/privacypolicy/"
            class="underline"
          >
            Datenschutzbedingungen für Anwendungen</NuxtLink
          >
          gefunden werden.
        </p>
        <br />
        <h3 class="text-3xl text-gray-200 mt-4 mb-2">
          Wie werden die Daten verwendet?
        </h3>
        Diese Daten werden für die Funktionalität des Discord-Bots und dieser
        Website benötigt. Es erfolgt keine Weitergabe an dritte Parteien.<br />
        <br />
        Für das Löschen Ihrer Daten können Sie mich über Discord (<code>{{
          MY_DISCORD_TAG
        }}</code
        >) oder per E-Mail erreichen:
        <NuxtLink to="mailto:flo@tectoast.de" class="underline"
          >flo@tectoast.de
        </NuxtLink>
        <br />
        Zuletzt bearbeitet: 16.02.2025 (inhaltlich 04.04.2024)
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<style scoped></style>
