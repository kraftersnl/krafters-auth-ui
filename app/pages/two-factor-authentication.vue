<script setup lang="ts">
/**
 * Second-factor step of the sign-in flow. `login` sends the user here with a
 * `?redirect=` query when Fortify answers with `two_factor: true`.
 *
 * Create a page at the same path in your app to override this one.
 */
definePageMeta({
  middleware: ['sanctum:guest'],
});

const { t } = useI18n();

useHead({ title: computed(() => t('mfa.heading')) });
</script>

<template>
  <NuxtLayout>
    <MfaChallenge />
  </NuxtLayout>
</template>
