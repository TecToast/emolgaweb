// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@pinia/nuxt",
    "nuxt-auth-utils",
    "nuxt-security",
    "@nuxt/eslint",
    "@vueuse/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 28,
      password: "",
    },
    emolgaBackendUrl: "",
  },
  app: {
    head: {
      title: "Emolga",
      link: [
        {
          rel: "me",
          href: "https://mastodon.social/@tectoast",
        },
      ],
    },
  },
  routeRules: {
    "/privacy": {
      redirect: "/de/privacy",
    },
    "/tos": {
      redirect: "/de/tos",
    },
    "/de/privacy": {
      prerender: true,
    },
    "/de/tos": {
      prerender: true,
    },
    "/en/privacy": {
      prerender: true,
    },
    "/en/tos": {
      prerender: true,
    },
  },
  security: {
    headers: {
      contentSecurityPolicy: false,
    },
  },
  vite: {
    server: {
      allowedHosts: [".trycloudflare.com"],
    },
  },
  icon: {
    clientBundle: {
      scan: true,
    },
  },
  compatibilityDate: "2025-02-16",
});
