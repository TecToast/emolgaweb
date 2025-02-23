<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";
const { user } = useUserSession();
const links: Ref<ButtonProps[]> = computed(() => {
  const result: ButtonProps[] = [
    {
      label: "Support-Server",
      icon: "i-simple-icons-discord",
      to: DISCORD_SERVER_INVITE_URL,
      external: true,
      size: "xl" as const,
      color: "info",
    },
  ];
  if (user.value) {
    result.push({
      label: "Dashboard",
      icon: "i-lucide-arrow-right",
      trailing: true,
      to: "/dashboard",
      size: "xl" as const,
    });
  } else if (!ALPHA) {
    result.push({
      label: "Login",
      icon: "i-simple-icons-discord",
      trailing: true,
      to: "/api/login",
      size: "xl" as const,
      color: "neutral",
      variant: "subtle",
      external: true,
    });
  }
  return result;
});
const features = {
  title: "Features",
  description:
    "Emolga besitzt eine Vielzahl an Features, die dir helfen, deine Pokémon-Liga zu organisieren. Viele davon sind noch nicht öffentlich verfügbar.",
  features: [
    {
      title: "Analyse von Pokémon Showdown! Replays",
      description:
        "Emolga kann Replays analysieren und Statistiken dazu ausgeben.",
    },
    {
      title: "Doc-Management [noch nicht öffentlich verfügbar]",
      description:
        "Emolga kann die Ergebnisse von Kämpfen in einem Dokument automatisiert speichern.",
    },
    {
      title: "Draft [noch nicht öffentlich verfügbar]",
      description:
        "Emolga kann vollständig die Organisation eines Drafts übernehmen. Dabei werden die Picks automatisch in das Dokument eingetragen, der nächste Spieler gepingt und vieles mehr.",
    },
    {
      title: "Tippspiele [noch nicht öffentlich verfügbar]",
      description:
        "Emolga kann vollautomatisiert Tippspiele posten und die Ergebnisse davon auswerten.",
    },
    {
      title: "YouTube-Feed [noch nicht öffentlich verfügbar]",
      description:
        "Emolga kann pünktlich zum Upload-Termin die Videos der Liga-Teilnehmer posten.",
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
