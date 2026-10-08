<script setup lang="ts">
const { headingLevel = 2 } = defineProps<{
  /** Level of the "Recovery codes" heading: one below the title it sits under. */
  headingLevel?: 2 | 3 | 4;
}>();

const { recoveryCodes, mfaError } = useMfa();
</script>

<template>
  <div class="mfa-enable-result-content">
    <AuthError v-if="mfaError" :data="mfaError" />

    <MfaRecoveryCodeList
      v-else-if="recoveryCodes.length"
      :heading-level="headingLevel"
    />
  </div>
</template>

<style>
.mfa-enable-result-content {
  display: grid;
}
</style>
