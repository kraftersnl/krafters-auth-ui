<script setup lang="ts">
/**
 * The enable flow — intro → QR code → confirm code → recovery codes — inline,
 * for a page rather than a dialog: a setup prompt after sign-in, an onboarding
 * step. `MfaDialog` keeps covering the same flow for account settings.
 *
 * Step headings are `h2`, so render it below the page's own `h1`. The buttons
 * are a slot, so an app can bring its own button component.
 */
const { skippable = true, autofocus = false } = defineProps<{
  /** Offer a way out of the flow before MFA is on. */
  skippable?: boolean;
  /** Focus the intro heading on mount. Leave off when the page moves focus itself. */
  autofocus?: boolean;
}>();

const emit = defineEmits<{
  /** The user chose to set up MFA later. */
  skip: [];
  /** MFA is on and the user has seen the recovery codes. */
  done: [];
  /**
   * MFA has actually been turned on. The layer refreshes the Sanctum identity
   * itself; handle this to re-sync any copy of the user your app keeps.
   */
  refresh: [];
}>();

const {
  mfaStep,
  mfaCredentials,
  mfaError,
  codeInputRef,
  loadingConfirmationCode,
  enableMfa,
  enterCode,
  resetMfa,
} = useMfa();

const formId = useId();
const headingRef = useTemplateRef<HTMLHeadingElement>('heading');
const loadingEnable = ref(false);

const heading = computed(() => {
  if (mfaStep.value === 4) return $t('mfa.done');
  if (mfaStep.value === 2 || mfaStep.value === 3) return $t('mfa.app-config');
  return $t('mfa.heading');
});

const canConfirm = computed(() => mfaCredentials.value.code.length === 6);

async function enable() {
  loadingEnable.value = true;
  await enableMfa();
  loadingEnable.value = false;
}

async function confirm() {
  if (await enterCode()) emit('refresh');
}

function next() {
  mfaStep.value = 3;
}

function back() {
  mfaStep.value = 2;
}

function skip() {
  emit('skip');
}

function finish() {
  emit('done');
}

/**
 * Each step replaces the content focus was in, so move it to the new heading.
 * The confirm step is the exception: its form focuses the code input.
 */
watch(mfaStep, async (step) => {
  if (step === 3) return;
  await nextTick();
  headingRef.value?.focus();
});

onMounted(() => {
  resetMfa();
  if (autofocus) headingRef.value?.focus();
});
</script>

<template>
  <div class="mfa-setup">
    <h2 ref="heading" tabindex="-1">
      <Icon
        v-if="mfaStep === 4"
        name="material-symbols:check-circle-outline-rounded"
      />
      {{ heading }}
    </h2>

    <div v-if="mfaStep === 1" class="mfa-setup-intro">
      <p>{{ $t('mfa.description') }}</p>

      <AuthError :data="mfaError" />
    </div>

    <MfaQr v-else-if="mfaStep === 2" />

    <Form
      v-else-if="mfaStep === 3"
      :id="formId"
      class="mfa-setup-code"
      :autofocus-fn="() => codeInputRef?.focusElement()"
      @submit="confirm"
    >
      <MfaCode />
    </Form>

    <MfaEnableResult v-else-if="mfaStep === 4" :heading-level="3" />

    <div class="mfa-setup-actions">
      <slot
        name="actions"
        :step="mfaStep"
        :skippable="skippable"
        :can-confirm="canConfirm"
        :loading-enable="loadingEnable"
        :loading-confirm="loadingConfirmationCode"
        :form-id="formId"
        :enable="enable"
        :next="next"
        :back="back"
        :skip="skip"
        :finish="finish"
      >
        <Button
          v-if="skippable && (mfaStep === 1 || mfaStep === 2)"
          variant="ghost"
          size="lg"
          :label="$t('mfa.skip')"
          @click="skip"
        />

        <Button
          v-if="mfaStep === 3"
          variant="ghost"
          size="lg"
          icon="material-symbols:arrow-back-rounded"
          :label="$t('general.back')"
          @click="back"
        />

        <Button
          v-if="mfaStep === 1"
          variant="primary"
          size="lg"
          :label="$t('mfa.enable')"
          :loading="loadingEnable"
          @click="enable"
        />

        <Button
          v-else-if="mfaStep === 2"
          variant="primary"
          size="lg"
          :label="$t('general.continue')"
          @click="next"
        />

        <Button
          v-else-if="mfaStep === 3"
          type="submit"
          :form="formId"
          variant="green"
          size="lg"
          icon="material-symbols:check-rounded"
          :label="$t('general.confirm')"
          :disabled="!canConfirm"
          :loading="loadingConfirmationCode"
        />

        <Button
          v-else-if="mfaStep === 4"
          variant="primary"
          size="lg"
          :label="$t('mfa.setup-finish')"
          @click="finish"
        />
      </slot>
    </div>
  </div>
</template>

<style>
.mfa-setup {
  h2 {
    margin-block: 0 1rem;
    font-size: var(--auth-font-size-step-heading, var(--font-size-lg));
  }

  /* The step heading only: the QR code step has an h2 of its own. */
  > h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .iconify {
      flex-shrink: 0;
      color: var(--color-green-graphic);
    }
  }

  .mfa-setup-intro p {
    max-width: 60ch;
  }

  .mfa-qr-code-wrapper {
    padding-inline: 0;

    .qr-code-wrapper svg {
      max-width: 100%;
      height: auto;
    }
  }

  .mfa-code-input {
    width: 100%;
  }

  .mfa-setup-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: space-between;
    padding-block-start: 1.5rem;
    border-block-start: 1px solid
      var(--auth-color-divider, var(--color-grey-light));

    > :only-child {
      margin-inline-start: auto;
    }

    .button {
      --font-size: var(--auth-font-size-dialog-button, var(--font-size-sm));
    }
  }
}
</style>
