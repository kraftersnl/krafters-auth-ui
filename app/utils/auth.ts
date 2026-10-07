/**
 * Pulls the renderable payload out of whatever the fetch layer threw.
 *
 * `ofetch` errors carry the body on `response._data`; a plain rejected
 * response or an already-unwrapped error carries it on `_data` / `data`.
 * Returns `null` when there is nothing worth showing, so callers can assign
 * the result straight to their error state.
 */
export function extractAuthError(error: unknown): AuthErrorData | null {
  const candidate = error as {
    response?: { _data?: AuthErrorData };
    _data?: AuthErrorData;
    data?: AuthErrorData;
  } | null;

  return (
    candidate?.response?._data ?? candidate?._data ?? candidate?.data ?? null
  );
}

/**
 * Whether a request was refused for want of a fresh password confirmation:
 * Laravel's `password.confirm` middleware answers 423 to a JSON request.
 */
export function isPasswordConfirmationRequired(error: unknown): boolean {
  const candidate = error as {
    status?: number;
    statusCode?: number;
    response?: { status?: number };
  } | null;

  return (
    (candidate?.response?.status ??
      candidate?.statusCode ??
      candidate?.status) === 423
  );
}
