// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    "/api/**": {
      proxy: "http://localhost:58700/api/**"
    }
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },
  modules: ["@nuxt/ui", "@nuxt/image", "@pinia/nuxt", /*"@nuxtus/nuxt-localtunnel"*/],
  app: {
    head: {
      title: "Emolga"
    }
  },
  imports: {
    presets: [
      {
        from: "vuedraggable",
        imports: ["draggable"]
      }
    ]
  }
  /*localtunnel: {
    subdomain: "emolga"
  }*/
})
