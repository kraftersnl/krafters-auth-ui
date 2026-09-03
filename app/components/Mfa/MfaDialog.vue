<script setup lang="ts">
const { mfaDialogRef, closeMfaDialog } = useMfaDialog();
const {
  mfaStep,
  loadingConfirmationCode,
  mfaCredentials,
  codeInputRef,
  enableMfa,
  disableMfa,
  enterCode,
  resetMfa,
} = useMfa();

const dialogLabel = computed(() => {
  if (mfaStep.value === 4) return 'mfa.done';
  if (mfaStep.value === 2 || mfaStep.value === 3) return 'mfa.app-config';

  return 'mfa.heading';
});

async function handleEnterCode() {
  const success = await enterCode();
  if (success) emit('refresh');
}

async function handleDisableMfa() {
  const success = await disableMfa();
  if (success) emit('refresh');
}

/**
 * `refresh` fires once MFA has actually been turned on or off, so the host app
 * can re-read its own copy of the user (the composable already refreshes the
 * Sanctum identity itself).
 */
const emit = defineEmits<{
  refresh: [];
}>();
</script>

<template>
  <Dialog
    ref="mfaDialogRef"
    :label="$t(dialogLabel)"
    class="mfa-dialog"
    :header-icon="
      mfaStep === 4
        ? 'material-symbols:check-circle-outline-rounded'
        : undefined
    "
    position="center"
    :click-outside="false"
    @close="resetMfa()"
  >
    <div v-if="mfaStep === 1" class="mfa-content">
      <p>{{ $t('mfa.description') }}</p>
    </div>

    <MfaQr v-if="mfaStep === 2" />

    <Form
      v-if="mfaStep === 3"
      id="mfa-code-confirmation-form"
      :autofocus-fn="() => codeInputRef?.focusElement()"
      @submit="handleEnterCode"
    >
      <MfaCode />
    </Form>

    <MfaEnableResult v-if="mfaStep === 4" />

    <div v-if="mfaStep === 5" class="mfa-content">
      <p>{{ $t('mfa.disable-description') }}</p>
    </div>

    <MfaDisableResult v-if="mfaStep === 6" />

    <hr class="mfa-dialog-divider" />

    <template #buttons>
      <Button
        v-if="mfaStep === 1"
        variant="primary"
        size="lg"
        :label="$t('mfa.enable')"
        @click="enableMfa()"
      />

      <Button
        v-if="mfaStep === 2"
        variant="primary"
        size="lg"
        :label="$t('general.continue')"
        @click="mfaStep = 3"
      />

      <Button
        v-if="mfaStep === 3"
        type="submit"
        form="mfa-code-confirmation-form"
        variant="green"
        size="lg"
        icon="material-symbols:check-rounded"
        :disabled="mfaCredentials.code.length !== 6"
        :loading="loadingConfirmationCode"
        :label="$t('general.confirm')"
      />

      <Button
        v-if="mfaStep === 4 || mfaStep === 6"
        variant="primary"
        size="lg"
        :label="$t('general.done')"
        @click="closeMfaDialog()"
      />

      <Button
        v-if="mfaStep === 5"
        variant="danger"
        size="lg"
        :label="$t('mfa.disable')"
        @click="handleDisableMfa()"
      />
    </template>
  </Dialog>
</template>

<style>
.mfa-dialog {
  width: 100%;
  max-width: 490px;

  .mfa-dialog-divider {
    margin-block-start: 1.5rem;
  }

  .mfa-code-confirmation {
    min-height: 200px;

    .mfa-code-input {
      margin-block-start: 1.5rem;
    }
  }

  .dialog-title-wrapper {
    .iconify {
      color: var(--color-green-graphic);
    }
  }

  .dialog-buttons {
    margin-block-start: 1.5rem;
  }

  .mfa-content {
    p {
      margin-block-end: 2.5rem;
    }
  }
}
</style>
