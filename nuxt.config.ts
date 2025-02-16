// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxt/ui-pro", "@nuxt/image", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  app: {
    head: {
      title: "Emolga",
    },
  },
  experimental: {
    buildCache: false,
  },
  compatibilityDate: "2025-02-16",
});
