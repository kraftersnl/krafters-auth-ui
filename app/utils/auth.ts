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
