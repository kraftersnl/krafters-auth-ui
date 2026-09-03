declare global {
  /**
   * Shape of a Laravel validation / error response, as rendered by
   * `AuthError.vue`.
   */
  type AuthErrorData = {
    message?: string;
    errors?: {
      [key: string]: string[];
    };
  };

  /**
   * The authenticated user's payload, as returned under `data` by the Sanctum
   * user endpoint.
   *
   * Deliberately empty: every app's payload differs, so each one augments this
   * interface with its own type from its own `declare global` block, and
   * `useAuth().user` is typed accordingly:
   *
   * ```ts
   * declare global {
   *   interface AuthUser extends User {}
   * }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AuthUser {}

  type LoginCredentials = {
    email: string;
    password: string;
    remember?: boolean;
  };

  /** Fortify answers `two_factor: true` when a second factor is still needed. */
  type LoginResponse = {
    two_factor?: boolean;
  };

  /** Where `LoginForm` renders its error relative to the submit button. */
  type LoginErrorPosition = 'above-submit' | 'below-submit';

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
