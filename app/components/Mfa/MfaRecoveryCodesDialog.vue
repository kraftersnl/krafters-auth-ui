<script setup lang="ts">
const { mfaRecoveryCodesDialogRef } = useMfaDialog();
const {
  mfaError,
  recoveryCodes,
  generateRecoveryCodes,
  loadingGenerateRecoveryCodes,
} = useMfa();
</script>

<template>
  <Dialog
    ref="mfaRecoveryCodesDialogRef"
    :label="$t('mfa.recovery-code', 2)"
    class="mfa-recovery-codes-dialog"
    position="center"
    :click-outside="false"
    @close="mfaError = null"
  >
    <MfaError v-if="mfaError" :data="mfaError" />

    <MfaRecoveryCodeList v-else-if="recoveryCodes.length" />

    <hr class="mfa-recovery-codes-divider" />

    <template #buttons>
      <Button
        variant="primary"
        size="lg"
        :label="$t('mfa.recovery-codes-generate')"
        icon="material-symbols:refresh-rounded"
        :loading="loadingGenerateRecoveryCodes"
        @click="generateRecoveryCodes()"
      />
    </template>
  </Dialog>
</template>

<style>
.mfa-recovery-codes-dialog {
  width: 100%;
  max-width: 490px;

  .mfa-recovery-codes-divider {
    margin-block-start: 1.5rem;
  }

  .dialog-buttons {
    margin-block-start: 1.5rem;
  }

  p {
    margin-block-start: 0;
  }
}
</style>
