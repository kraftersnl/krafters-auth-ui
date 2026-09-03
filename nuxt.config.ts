export default defineNuxtConfig({
  pages: true,

  typescript: {
    includeWorkspace: true,
  },

  // Only the locale files are declared here. Strategy, default locale and
  // browser detection are owned by the consuming app (or by Krafters UI);
  // @nuxtjs/i18n deep-merges the messages of every layer that declares the
  // same locale code, so `mfa.*` lands alongside the app's own namespaces.
  i18n: {
    locales: [
      { code: 'en', language: 'en', file: 'en.json', name: 'English' },
      { code: 'nl', language: 'nl', file: 'nl.json', name: 'Nederlands' },
    ],
  },

  compatibilityDate: '2026-04-03',
});
