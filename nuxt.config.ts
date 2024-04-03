// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },
  modules: ["@nuxt/ui", "@nuxt/image", "@pinia/nuxt"],
  app: {
    head: {
      title: "Emolga"
    }
  }
})
