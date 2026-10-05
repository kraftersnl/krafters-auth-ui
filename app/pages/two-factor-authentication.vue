<script setup lang="ts">
/**
 * Second-factor step of the sign-in flow. `login` sends the user here with a
 * `?redirect=` query when Fortify answers with `two_factor: true`.
 *
 * Create a page at the same path in your app to override this one.
 */
definePageMeta({
  // Read by nuxt-auth-sanctum's global middleware, so it lets the
  // not-yet-authenticated user through instead of sending them back to login.
  // `sanctum:guest` can't be used here: global mode doesn't register it.
  sanctum: { guestOnly: true },
});

const { t } = useI18n();

useHead({ title: computed(() => t('mfa.heading')) });
</script>

<template>
  <NuxtLayout>
    <MfaChallenge />
  </NuxtLayout>
</template>
