<script setup lang="ts">
const {
  loadingSolveMfaChallenge,
  codeInputRef,
  recoveryCodeInputRef,
  mfaCredentials,
  mfaError,
  solveMfaChallenge,
} = useMfa();

const useRecoveryCode = ref(false);

const canSubmit = computed(
  () =>
    (useRecoveryCode.value && !!mfaCredentials.value.recovery_code?.length) ||
    (!useRecoveryCode.value && mfaCredentials.value.code?.length === 6),
);

async function toggleUseRecoveryCode() {
  useRecoveryCode.value = !useRecoveryCode.value;

  mfaCredentials.value = {
    code: '',
    recovery_code: '',
  };

  mfaError.value = null;

  // The other input only exists after the swap has rendered, so its ref is
  // still empty (or stale) until the next tick.
  await nextTick();

  if (useRecoveryCode.value) recoveryCodeInputRef.value?.focusElement();
  else codeInputRef.value?.focusElement();
}
</script>

<template>
  <div class="mfa-challenge-wrapper">
    <div class="mfa-header">
      <h1>{{ $t('mfa.heading') }}</h1>

      <p v-if="useRecoveryCode">
        {{ $t('mfa.recovery-code-instructions') }}
      </p>

      <p v-else>{{ $t('mfa.challenge-instructions') }}</p>
    </div>

    <Card background-color="white" class="mfa-card">
      <Form
        class="mfa-form"
        :autofocus-fn="
          () =>
            useRecoveryCode
              ? recoveryCodeInputRef?.focusElement()
              : codeInputRef?.focusElement()
        "
        @submit="solveMfaChallenge"
      >
        <MfaRecoveryCode v-if="useRecoveryCode" />

        <MfaCode v-else />

        <Button
          type="submit"
          :label="$t('general.sign-in')"
          size="xl"
          font-size="md"
          variant="green"
          icon-pos="end"
          icon="material-symbols:arrow-forward-rounded"
          :loading="loadingSolveMfaChallenge"
          :disabled="!canSubmit"
        />

        <p v-if="useRecoveryCode" class="mfa-footer">
          <Button
            variant="link"
            :label="$t('mfa.use-code')"
            @click="toggleUseRecoveryCode"
          />
        </p>

        <p v-else class="mfa-footer">
          <span>
            {{ $t('mfa.recovery-code-cta') }}
          </span>

          <Button
            variant="link"
            :label="$t('mfa.use-recovery-code')"
            @click="toggleUseRecoveryCode"
          />
        </p>
      </Form>
    </Card>
  </div>
</template>

<style>
.mfa-challenge-wrapper {
  max-width: 410px;
  margin-block-start: 15vh;
  margin-inline: auto;
  text-align: center;

  .mfa-header {
    h1 {
      font-size: var(--font-size-xxl);
      font-weight: var(--font-weight-bold);
      margin-block-end: 0rem;
    }

    p {
      max-width: none;
      margin-block-end: 2.5rem;
      font-size: var(--font-size-lg);
      color: var(--color-grey-text);
    }
  }

  .mfa-card {
    max-width: 360px;
    margin-inline: auto;
  }

  button[type='submit'] {
    max-width: 280px;
    margin-inline: auto;
  }

  .auth-error {
    p,
    ul {
      font-size: var(--font-size-sm);
    }
  }

  .mfa-footer {
    font-size: var(--font-size-sm);

    > span {
      color: var(--color-grey-text);
    }
  }
}
</style>
