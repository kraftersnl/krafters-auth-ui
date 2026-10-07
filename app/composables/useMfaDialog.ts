/**
 * Holds the refs to the two MFA dialogs and opens them in the right flow, so
 * consumers never have to know about the dialog's internal step numbers.
 */
export function useMfaDialog() {
  const { mfaStep, resetMfa, getRecoveryCodes } = useMfa();
  const {
    ensurePasswordConfirmed,
    isPasswordConfirmed,
    requestPasswordConfirmation,
  } = usePasswordConfirmation();

  /**
   * Loading state for whatever opens the recovery codes, only while the codes
   * load without a password confirmation: when one is needed, its dialog's
   * Confirm button carries the loading state instead.
   */
  const loadingMfaRecoveryCodesDialog = useState(
    'loadingMfaRecoveryCodesDialog',
    () => false,
  );

  const mfaDialogRef = useState<DialogComponent | null>(
    'mfaDialogRef',
    () => null,
  );

  const mfaRecoveryCodesDialogRef = useState<DialogComponent | null>(
    'mfaRecoveryCodesDialogRef',
    () => null,
  );

  /**
   * Opens the dialog on the "turn MFA on" flow: intro → QR → confirm code.
   * Asks for the password first when Fortify will, so that dialog never opens
   * on top of this one.
   */
  async function openMfaEnableDialog() {
    if (!(await ensurePasswordConfirmed())) return;
    resetMfa();
    mfaDialogRef.value?.openDialog();
  }

  /** Opens the dialog on the "turn MFA off" confirmation step, after the password. */
  async function openMfaDisableDialog() {
    if (!(await ensurePasswordConfirmed())) return;
    resetMfa();
    mfaStep.value = 5;
    mfaDialogRef.value?.openDialog();
  }

  function closeMfaDialog() {
    mfaDialogRef.value?.closeDialog();
  }

  /**
   * Fetches the current recovery codes, then shows them. Asks for the password
   * first, like the other flows: a confirmation the user cancels opens nothing.
   * When it asks, the codes load under the password dialog's Confirm button.
   */
  async function openMfaRecoveryCodesDialog() {
    if (await isPasswordConfirmed()) {
      loadingMfaRecoveryCodesDialog.value = true;
      await getRecoveryCodes();
      loadingMfaRecoveryCodesDialog.value = false;
    } else if (!(await requestPasswordConfirmation(getRecoveryCodes))) {
      return;
    }

    mfaRecoveryCodesDialogRef.value?.openDialog();
  }

  function closeMfaRecoveryCodesDialog() {
    mfaRecoveryCodesDialogRef.value?.closeDialog();
  }

  return {
    mfaDialogRef,
    mfaRecoveryCodesDialogRef,
    loadingMfaRecoveryCodesDialog,
    openMfaEnableDialog,
    openMfaDisableDialog,
    closeMfaDialog,
    openMfaRecoveryCodesDialog,
    closeMfaRecoveryCodesDialog,
  };
}
