declare global {
  /**
   * Shape of a Laravel validation / error response, as rendered by
   * `MfaError.vue`.
   */
  type MfaErrorData = {
    message?: string;
    errors?: {
      [key: string]: string[];
    };
  };

  type MfaCredentials = {
    code: string;
    recovery_code: string;
  };

  /**
   * Step the MFA dialog is showing. Consumers do not set this directly —
   * use `useMfaDialog()` to open the dialog in the right flow.
   *
   * 1 enable intro          4 enabled + recovery codes
   * 2 scan QR code          5 disable confirmation
   * 3 confirm with code     6 disabled
   */
  type MfaStep = 1 | 2 | 3 | 4 | 5 | 6;
}

export {};
