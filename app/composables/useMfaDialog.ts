/**
 * Holds the refs to the two MFA dialogs and opens them in the right flow, so
 * consumers never have to know about the dialog's internal step numbers.
 */
export function useMfaDialog() {
  const { mfaStep, resetMfa, getRecoveryCodes } = useMfa();

  const mfaDialogRef = useState<DialogComponent | null>(
    'mfaDialogRef',
    () => null,
  );

  const mfaRecoveryCodesDialogRef = useState<DialogComponent | null>(
    'mfaRecoveryCodesDialogRef',
    () => null,
  );

  /** Opens the dialog on the "turn MFA on" flow: intro → QR → confirm code. */
  function openMfaEnableDialog() {
    resetMfa();
    mfaDialogRef.value?.openDialog();
  }

  /** Opens the dialog on the "turn MFA off" confirmation step. */
  function openMfaDisableDialog() {
    resetMfa();
    mfaStep.value = 5;
    mfaDialogRef.value?.openDialog();
  }

  function closeMfaDialog() {
    mfaDialogRef.value?.closeDialog();
  }

  /** Fetches the current recovery codes, then shows them. */
  async function openMfaRecoveryCodesDialog() {
    await getRecoveryCodes();
    mfaRecoveryCodesDialogRef.value?.openDialog();
  }

  function closeMfaRecoveryCodesDialog() {
    mfaRecoveryCodesDialogRef.value?.closeDialog();
  }

  return {
    mfaDialogRef,
    mfaRecoveryCodesDialogRef,
    openMfaEnableDialog,
    openMfaDisableDialog,
    closeMfaDialog,
    openMfaRecoveryCodesDialog,
    closeMfaRecoveryCodesDialog,
  };
}
