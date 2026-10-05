<script setup lang="ts">
/**
 * Second-factor step of the sign-in flow. `login` sends the user here with a
 * `?redirect=` query when Fortify answers with `two_factor: true`.
 *
 * Create a page at the same path in your app to override this one.
 */
definePageMeta({
  // Guests only, in either nuxt-auth-sanctum middleware mode. With global
  // middleware on, `guestOnly` stops it from sending the not-yet-authenticated
  // user back to the login page. With it off, the check below does what
  // `sanctum:guest` would — that name can't be used here, because global mode
  // doesn't register it and the page would fail to load.
  sanctum: { guestOnly: true },
  middleware: [
    () => {
      const { isAuthenticated } = useSanctumAuth();

      if (!isAuthenticated.value) return;

      const { onGuestOnly } = useSanctumConfig().redirect;

      if (onGuestOnly === undefined) {
        throw new Error('`sanctum.redirect.onGuestOnly` is not configured');
      }

      if (onGuestOnly === false) throw createError({ statusCode: 403 });

      return navigateTo(onGuestOnly, { replace: true });
    },
  ],
});

const { t } = useI18n();

useHead({ title: computed(() => t('mfa.heading')) });
</script>

<template>
  <NuxtLayout>
    <MfaChallenge />
  </NuxtLayout>
</template>
