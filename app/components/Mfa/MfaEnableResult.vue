<script setup lang="ts">
const { recoveryCodes, mfaError } = useMfa();
</script>

<template>
  <div class="mfa-enable-result-content">
    <AuthError v-if="mfaError" :data="mfaError" />

    <template v-else-if="recoveryCodes.length">
      <h2>{{ $t('mfa.recovery-code', 2) }}</h2>
      <MfaRecoveryCodeList />
    </template>
  </div>
</template>

<style>
.mfa-enable-result-content {
  display: grid;
}
</style>
