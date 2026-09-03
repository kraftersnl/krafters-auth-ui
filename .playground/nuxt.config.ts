export default defineNuxtConfig({
  // The layer under development, plus the UI layer it depends on.
  extends: ['..', 'github:kraftersnl/krafters-ui'],

  ssr: false,

  modules: ['nuxt-auth-sanctum'],

  // Points at nothing real: the demo exercises layout, focus order and
  // translations, not the Fortify endpoints.
  sanctum: {
    baseUrl: 'http://localhost:8000',
    client: {
      initialRequest: false,
    },
    redirect: {
      onAuthOnly: '/',
      onGuestOnly: '/',
      onLogout: '/',
    },
  },

  i18n: {
    defaultLocale: 'en',
  },

  app: {
    head: {
      title: 'Krafters Auth UI',
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  css: ['~/assets/tokens.css'],

  devServer: {
    port: 3004,
  },

  compatibilityDate: '2026-04-03',
});
