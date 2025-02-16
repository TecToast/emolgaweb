<script setup lang="ts">
const links = [
  {
    label: "Dashboard",
    icon: "i-lucide-arrow-right",
    trailing: true,
    to: "/",
    size: "xl" as "xl",
  },
];
const features = {
  title: "Features",
  description:
    "Emolga besitzt eine Vielzahl an Features, die dir helfen, deine Pokémon-Liga zu organisieren.",
  features: [
    {
      title: "Analyse von Pokémon Showdown! Replays",
      description: "Emolga kann Replays analysieren und das Ergebnis ausgeben.",
    },
    {
      title: "Draft [noch nicht verfügbar]",
      description:
        "Emolga kann vollständig die Organisation eines Drafts übernehmen. Dabei werden die Picks automatisch in das Dokument eingetragen, der nächste Spieler gepingt und vieles mehr.",
    },
    {
      title: "Tippspiele [noch nicht verfügbar]",
      description:
        "Emolga kann vollautomatisiert Tippspiele posten und die Ergebnisse davon auswerten.",
    },
    {
      title: "Und noch vieles mehr!",
      description:
        "Bisher sind die allermeisten Features von Emolga noch nicht öffentlich, dies wird sich in der Zukunft allerdings ändern.",
    },
  ],
};
</script>

<template>
  <div class="relative">
    <UPageHero
      :title="'Emolga'"
      :description="`Ein Discord-Bot für die Organisation von Pokémon-Ligen. Diese Seite befindet sich noch im Aufbau. Entwickelt von ${MY_DISCORD_TAG}.`"
      :links="links"
      class="relative"
    >
    </UPageHero>

    <UPageSection v-bind="features" />
  </div>
</template>

<style scoped></style>
