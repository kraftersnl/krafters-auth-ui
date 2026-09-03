/**
 * Drives the Laravel Fortify two-factor endpoints and holds the shared state
 * the MFA components render.
 *
 * State is kept in `useState` so every component in the flow (the dialog, its
 * steps, the challenge page) reads the same instance without prop drilling.
 */
export function useMfa() {
  const { client, refreshIdentity, loginRedirectTarget } = useAuth();

  const mfaStep = useState<MfaStep>('mfaStep', () => 1);
  const qrCode = useState('qrCode', () => '');
  const recoveryCodes = useState<string[]>('recoveryCodes', () => []);
  const mfaError = useState<AuthErrorData | null>('mfaError', () => null);

  const mfaCredentials = useState<MfaCredentials>('mfaCredentials', () => ({
    code: '',
    recovery_code: '',
  }));

  const loadingGenerateRecoveryCodes = useState(
    'loadingGenerateRecoveryCodes',
    () => false,
  );

  const loadingConfirmationCode = useState(
    'loadingConfirmationCode',
    () => false,
  );

  const loadingSolveMfaChallenge = useState(
    'loadingSolveMfaChallenge',
    () => false,
  );

  const codeInputRef = useState<InputComponent | null>(
    'codeInputRef',
    () => null,
  );

  const recoveryCodeInputRef = useState<InputComponent | null>(
    'recoveryCodeInputRef',
    () => null,
  );

  function setMfaError(error: unknown) {
    mfaError.value = extractAuthError(error);
  }

  function resetMfa() {
    mfaStep.value = 1;
    qrCode.value = '';
    mfaError.value = null;
    loadingConfirmationCode.value = false;
    loadingSolveMfaChallenge.value = false;
    mfaCredentials.value = {
      code: '',
      recovery_code: '',
    };
  }

  async function getRecoveryCodes() {
    mfaError.value = null;

    try {
      const codes = await client<string[]>(
        '/api/user/two-factor-recovery-codes',
      );
      if (codes?.length) recoveryCodes.value = codes;
    } catch (error) {
      setMfaError(error);
    }
  }

  async function generateRecoveryCodes() {
    mfaError.value = null;
    loadingGenerateRecoveryCodes.value = true;

    try {
      await client('/api/user/two-factor-recovery-codes', {
        method: 'POST',
      });
      await getRecoveryCodes();
    } catch (error) {
      setMfaError(error);
    } finally {
      loadingGenerateRecoveryCodes.value = false;
    }
  }

  async function enableMfa() {
    mfaError.value = null;

    try {
      await client('/api/user/two-factor-authentication', {
        method: 'POST',
      });
      mfaStep.value = 2;
      await refreshIdentity();
    } catch (error) {
      setMfaError(error);
    }
  }

  async function disableMfa() {
    mfaError.value = null;

    try {
      await client('/api/user/two-factor-authentication', {
        method: 'DELETE',
      });
      mfaStep.value = 6;
      await refreshIdentity();
      return true;
    } catch (error) {
      setMfaError(error);
      return false;
    }
  }

  async function getQrCode() {
    mfaError.value = null;

    try {
      const data = await client<{ svg?: string }>(
        '/api/user/two-factor-qr-code',
      );
      if (data?.svg) qrCode.value = data.svg;
    } catch (error) {
      setMfaError(error);
    }
  }

  async function enterCode() {
    mfaError.value = null;
    loadingConfirmationCode.value = true;

    try {
      await client('/api/user/confirmed-two-factor-authentication', {
        method: 'POST',
        body: mfaCredentials.value,
      });
      await getRecoveryCodes();
      mfaStep.value = 4;
      return true;
    } catch (error) {
      setMfaError(error);
      return false;
    } finally {
      loadingConfirmationCode.value = false;
    }
  }

  /**
   * Completes the second factor at sign-in and continues to wherever the
   * interrupted login was headed, following the app's Sanctum redirect config.
   */
  async function solveMfaChallenge() {
    mfaError.value = null;
    loadingSolveMfaChallenge.value = true;

    const redirect = loginRedirectTarget();

    try {
      await client('/api/two-factor-challenge', {
        method: 'POST',
        body: mfaCredentials.value,
      });
      await refreshIdentity();

      if (redirect !== false) await navigateTo(redirect);
    } catch (error) {
      setMfaError(error);
    } finally {
      loadingSolveMfaChallenge.value = false;
    }
  }

  return {
    mfaStep,
    mfaCredentials,
    mfaError,
    qrCode,
    recoveryCodes,
    loadingConfirmationCode,
    loadingSolveMfaChallenge,
    loadingGenerateRecoveryCodes,
    codeInputRef,
    recoveryCodeInputRef,
    getRecoveryCodes,
    generateRecoveryCodes,
    resetMfa,
    enableMfa,
    disableMfa,
    getQrCode,
    enterCode,
    solveMfaChallenge,
  };
}
