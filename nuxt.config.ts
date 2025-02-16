// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  future: {
    compatibilityVersion: 4,
  },
  routeRules: {
    "/api/**": {
      proxy: "http://localhost:58700/api/**",
    },
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: ["@nuxt/ui", "@nuxt/image", "@pinia/nuxt"],
  app: {
    head: {
      title: "Emolga",
    },
  },
  compatibilityDate: "2025-02-16",
});
