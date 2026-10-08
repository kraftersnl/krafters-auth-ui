# Krafters Auth UI

Accessible authentication UX for [Nuxt](https://nuxt.com) SPAs backed by [Laravel Fortify](https://laravel.com/docs/fortify), in TypeScript.

Krafters Auth UI is a [Nuxt Layer](https://nuxt.com/docs/getting-started/layers) in a public repository. It ships sign-in and the whole MFA flow — login, the second factor at sign-in, enable, scan, confirm, recovery codes, disable — so each app wires up a form and two dialogs instead of rebuilding them.

Only the _forms_ live here. Page layout — headings, tabs, logos, forgot-password links — stays with each app, and every part an app is likely to restyle is a slot. Cardan Auditor and Cardan Academy share this layer while looking nothing alike.

## Dependencies

This layer does **not** stand on its own. Extend it alongside its two dependencies:

| Dependency                                                            | Why                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Krafters UI](https://github.com/kraftersnl/krafters-ui)              | Supplies every component used here (`Button`, `Card`, `Dialog`, `Form`, `Input`, `CopyButton`), the `@nuxtjs/i18n` / `@nuxt/icon` / `@nuxtjs/color-mode` module setup, and the **design tokens** all styling in this layer is written against. Extend it as a layer — a peer of this one, not a nested dependency. |
| [nuxt-auth-sanctum](https://github.com/manchenkoff/nuxt-auth-sanctum) | Provides `useSanctumClient()` and `useSanctumAuth()`, which this layer calls for the Fortify endpoints. Install it as a module in your app.                                                                                                                                                                        |

### Design tokens

Every rule in this layer styles with Krafters UI token _names_ — the colors, font sizes and radii Krafters UI documents:

`--color-text` · `--color-grey-text` · `--color-grey-light` · `--color-card-bg` · `--color-white` · `--color-red-text` · `--color-red-bg` · `--color-green-graphic` · `--font-size-xs|sm|md|lg|xxl|xxxl` · `--font-weight-bold` · `--radius-sm|md`

Krafters UI defines default values for these in its `app/assets/main.css`, but that file is a template rather than an auto-loaded stylesheet — each app keeps its own palette under those names, exactly as it already does for Krafters UI components. If your app renders Krafters UI correctly, this layer inherits the same theming, dark mode included, with no extra CSS.

### Divider color

The dividers in `LoginForm` and the MFA dialogs are drawn as a 1px background-colored line, so they don't depend on how your app resets `<hr>`. Their color is `--auth-color-divider`, which falls back to `--color-grey-light`:

```css
:root {
  --auth-color-divider: var(--color-grey-bg);
}
```

### Font sizes

Apps don't agree on what a font size token _name_ means: one app's `--font-size-sm` is `0.875rem`, another's is `1.125rem`. So the layer never asks for a size by name directly. Each piece of text reads a role token, which falls back to the Krafters UI scale when the app leaves it unset:

| Token                                  | Default            | Used for                                                          |
| -------------------------------------- | ------------------ | ----------------------------------------------------------------- |
| `--auth-font-size-heading`             | `--font-size-xxl`  | Sign-in challenge title                                           |
| `--auth-font-size-intro`               | `--font-size-lg`   | Sign-in challenge intro text                                      |
| `--auth-font-size-step-heading`        | `--font-size-lg`   | Step heading of `MfaSetup`                                        |
| `--auth-font-size-label`               | `--font-size-md`   | Code input labels, QR code and recovery codes headings            |
| `--auth-font-size-small`               | `--font-size-sm`   | Helper and validation text, QR code description, footer links     |
| `--auth-font-size-error`               | `--font-size-xs`   | `.auth-error`                                                     |
| `--auth-font-size-otp-input`           | `--font-size-xxxl` | One-time code input digits                                        |
| `--auth-font-size-recovery-code-input` | `--font-size-lg`   | Recovery code input on the sign-in challenge                      |
| `--auth-font-size-recovery-code-list`  | `--font-size-sm`   | List of recovery codes                                            |
| `--auth-font-size-button`              | `--font-size-md`   | Submit buttons on the login form and sign-in challenge            |
| `--auth-font-size-dialog-button`       | `--font-size-sm`   | Action buttons in the MFA dialogs, the copy recovery codes button |

If your app uses the Krafters UI scale, set nothing. If your scale is shifted, map the roles that come out wrong:

```css
:root {
  --auth-font-size-heading: var(--font-size-xl);
  --auth-font-size-small: var(--font-size-xs);
}
```

The fallbacks are resolved on the element itself, not on `:root`, so redefining `--font-size-*` for part of a page still reaches the layer. You can also set a role token on a single container, such as `.login-page`, to change only that page.

The recovery code list shows two columns when two codes fit side by side and one column otherwise, so a code never breaks across lines at any font size.

The two button tokens reach a Krafters UI `Button` through its `--font-size` property. So `--auth-font-size-button` also applies to a `Button` you pass into the `submit` slot of `LoginForm`; give that `Button` its own `font-size` prop to opt out. A button component of your own doesn't read `--font-size`, so map the token to whatever property it does read.

### Overriding styles

The layer's own class names are stable hooks you can restyle from your app: `.login-form`, `.auth-error`, `.mfa-dialog`, `.mfa-setup`, `.mfa-challenge-wrapper`, `.mfa-code-input`, `.mfa-recovery-codes-card`.

`.auth-error` is deliberately _not_ your app's `.error-message`. Reusing that class would mean two global definitions of one selector resolving by source order, and your error component's CSS chunk is not necessarily loaded on the page a login form sits on. `.auth-error` is written purely in tokens, so it picks up your palette and dark mode; restyle it if your errors look different elsewhere:

```css
.login-form .auth-error {
  min-width: 100%;
}
```

## How to extend from Krafters Auth UI in your project

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    'github:kraftersnl/krafters-auth-ui',
    'github:kraftersnl/krafters-ui',
  ],

  modules: ['nuxt-auth-sanctum'],
});
```

When you develop the layers side by side locally, point at the checkouts instead:

```ts
export default defineNuxtConfig({
  $development: {
    extends: ['../krafters-auth-ui', '../krafters-ui'],
  },

  $production: {
    extends: [
      'github:kraftersnl/krafters-auth-ui',
      'github:kraftersnl/krafters-ui',
    ],
  },
});
```

### Backend

The layer calls the stock Fortify endpoints, relative to your configured `sanctum.baseUrl`:

| Endpoint                                        | Method            | Used for                                      |
| ----------------------------------------------- | ----------------- | --------------------------------------------- |
| `/api/user/two-factor-authentication`           | `POST` / `DELETE` | Enable / disable MFA                          |
| `/api/user/two-factor-qr-code`                  | `GET`             | The setup QR code (inline SVG)                |
| `/api/user/confirmed-two-factor-authentication` | `POST`            | Confirm the first code                        |
| `/api/user/two-factor-recovery-codes`           | `GET` / `POST`    | Read / regenerate recovery codes              |
| `/api/two-factor-challenge`                     | `POST`            | Second factor at sign-in                      |
| your `sanctum.endpoints.login`                  | `POST`            | Sign in (path taken from your Sanctum config) |

Enable Fortify's `two-factor-authentication` feature with `confirm: true`, and expose whether MFA is on for the current user in your `/api/user` payload.

## Usage

### Signing in

Drop `<LoginForm />` into your own login page. It posts to the login endpoint from your Sanctum config, refreshes the identity, and redirects following the same `redirect.keepRequestedRoute` / `redirect.onLogin` rules nuxt-auth-sanctum applies itself — and when Fortify answers `two_factor: true` it sends the user to the challenge page instead, carrying the `?redirect=` along.

The defaults render the Cardan Auditor form: email, password with a reveal button, error region, rule, then a green submit button.

```vue
<script setup lang="ts">
// With nuxt-auth-sanctum's global middleware on, use
// `sanctum: { guestOnly: true }` instead: `sanctum:guest` only exists with it off.
definePageMeta({ middleware: ['sanctum:guest'] });

// Share the typed address with the forgot-password form beside it.
const { userEmail } = useUserProfileDetails();
</script>

<template>
  <Card>
    <LoginForm v-model:email="userEmail" />
  </Card>
</template>
```

#### Making it look like your app

Everything variable is a slot or a small prop. The Cardan Academy form has no reveal button, no rule, its own `BaseButton`, the error below the button, and holds the spinner through the page transition — all of it from the outside:

```vue
<LoginForm
  :show-password-toggle="false"
  :divider="false"
  remember
  error-position="below-submit"
  :loading-delay="lgTransition"
>
  <template #submit="{ submitting }">
    <BaseButton
      type="submit"
      :label="$t('general.sign-in')"
      icon="material-symbols:arrow-right-alt"
      icon-pos="end"
      :loading="submitting"
      variant="black"
      font-size="xs"
      :height="40"
    />
  </template>
</LoginForm>
```

| Prop                 | Default                        |                                                                       |
| -------------------- | ------------------------------ | --------------------------------------------------------------------- |
| `showPasswordToggle` | `true`                         | Reveal-password button beside the password field                      |
| `divider`            | `true`                         | Rule between the fields and the submit button                         |
| `remember`           | `false`                        | Send `remember: true` with the credentials                            |
| `errorPosition`      | `'above-submit'`               | Or `'below-submit'`                                                   |
| `size`               | `'lg'`                         | Input size                                                            |
| `autofocus`          | `true`                         | Focus the email field on mount                                        |
| `shake`              | `true`                         | Shake the fields when credentials are rejected                        |
| `twoFactorPath`      | `'/two-factor-authentication'` | Where to go when a second factor is needed                            |
| `loadingDelay`       | `0`                            | Hold the submit button loading this many ms after the request settles |

| Slot     | Scope            |                                                              |
| -------- | ---------------- | ------------------------------------------------------------ |
| `submit` | `{ submitting }` | The submit button                                            |
| `error`  | `{ error }`      | The error region                                             |
| `fields` |                  | Extra fields after the password, e.g. a remember-me checkbox |
| `footer` |                  | Anything at the end of the form                              |

| Model / Event   |                                                                                   |
| --------------- | --------------------------------------------------------------------------------- |
| `v-model:email` | Optional. Bind it to share the address with a sibling form; local state otherwise |
| `@success`      | Credentials accepted and the identity refreshed                                   |
| `@two-factor`   | Credentials accepted, second factor required                                      |
| `@error`        | Login rejected, with the error payload                                            |

### Sign-in challenge

The layer registers the page **`/two-factor-authentication`** for you, and `LoginForm` sends the user there on its own — nothing to wire up. It reads the `?redirect=` and continues there once the second factor is accepted, offers a recovery code as an alternative to the app code, and renders inside your app's default layout.

To place the challenge somewhere else — a different route, a bespoke layout — create your own page (a page in your app wins over the layer's), render `<MfaChallenge />` in it, and point `LoginForm`'s `twoFactorPath` at it.

### Enabling, disabling and recovery codes

Mount the two dialogs once on the page that holds your account settings, and drive them from `useMfaDialog()`:

```vue
<script setup lang="ts">
const { user, refreshUser } = useMyAuth();

const {
  openMfaEnableDialog,
  openMfaDisableDialog,
  openMfaRecoveryCodesDialog,
} = useMfaDialog();
</script>

<template>
  <Button
    v-if="user.mfaEnabled"
    :label="$t('mfa.disable')"
    variant="outline"
    @click="openMfaDisableDialog()"
  />

  <Button
    v-else
    :label="$t('mfa.enable')"
    variant="outline"
    @click="openMfaEnableDialog()"
  />

  <Button
    v-if="user.mfaEnabled"
    :label="$t('mfa.recovery-codes-show')"
    variant="outline"
    @click="openMfaRecoveryCodesDialog()"
  />

  <MfaDialog @refresh="refreshUser()" />

  <MfaRecoveryCodesDialog />
</template>
```

`MfaDialog` emits **`refresh`** once MFA has actually been turned on or off. The layer already refreshes the Sanctum identity itself; handle `refresh` to re-sync any copy of the user your app keeps of its own, so an "MFA enabled" badge updates immediately.

If that handler takes the user elsewhere after MFA is turned off (say, back to a setup page because MFA is required), pass `:show-disable-result="false"`. The dialog then skips its "MFA is off" step and keeps the disable button loading until your handler closes it with `closeMfaDialog()`.

Whether MFA is currently on stays your app's call — the flag lives in your `/api/user` response, and its name differs per backend, so the layer never guesses at it.

### Setting up MFA on a page

`MfaSetup` walks the same enable flow as `MfaDialog` — intro → QR code → confirm code → recovery codes — inline, for a page instead of a dialog: a prompt after sign-in, or a step in onboarding. Its step headings are `h2`, so give the page its own `h1`; `mfa.setup-title` and `mfa.setup-description` are there for it.

```vue
<template>
  <h1>{{ $t('mfa.setup-title') }}</h1>
  <p>{{ $t('mfa.setup-description') }}</p>

  <MfaSetup
    @refresh="refreshUser()"
    @skip="navigateTo('/')"
    @done="navigateTo('/')"
  />
</template>
```

| Prop        | Default |                                                                  |
| ----------- | ------- | ---------------------------------------------------------------- |
| `skippable` | `true`  | Offer "Skip for now" before MFA is on. Turn off to require setup |
| `autofocus` | `false` | Focus the intro heading on mount                                 |

| Event      |                                                                       |
| ---------- | --------------------------------------------------------------------- |
| `@skip`    | The user chose to set up MFA later                                    |
| `@done`    | MFA is on and the user confirmed they stored the recovery codes       |
| `@refresh` | MFA has actually been turned on — re-sync your app's copy of the user |

The buttons are the `actions` slot, so an app can bring its own button component. Its scope carries everything the default buttons use: `step` (1–4), `skippable`, `canConfirm`, `loadingEnable`, `loadingConfirm`, `formId` (put `type="submit"` and `:form="formId"` on the confirm button of step 3), and the handlers `enable`, `next`, `back`, `skip` and `finish`.

### Password confirmation

With `confirmPassword` on in Fortify's `twoFactorAuthentication` feature (recommended, and Fortify's default), every two-factor settings route sits behind `password.confirm` and answers **423** until the user has re-entered their password. The layer handles that for you: mount `<PasswordConfirmationDialog />` once, in your layout (it names the account to password managers with a hidden `autocomplete="username"` field, the `email` of your user payload unless you pass `username`), and every MFA call asks for the password when Fortify does and then retries. `openMfaEnableDialog()` and `openMfaDisableDialog()` ask up front instead, so the password dialog never opens on top of the MFA dialog.

The confirmation holds for your app's `auth.password_timeout`. For a sensitive change, keep that short: Laravel's default is three hours.

For changes of your own behind `password.confirm`, use the same composable:

```ts
const { ensurePasswordConfirmed, withPasswordConfirmation } =
  usePasswordConfirmation();

// Ask up front, before opening a flow…
if (!(await ensurePasswordConfirmed())) return;

// …or only when the server answers 423, and retry once.
await withPasswordConfirmation(() =>
  client('/api/sensitive', { method: 'POST' }),
);
```

`requestPasswordConfirmation(afterConfirm)` takes an optional function that runs once the password is accepted, before the dialog closes, with its Confirm button still loading. `openMfaRecoveryCodesDialog()` uses it to load the codes, so the user sees one action in progress from Confirm until the codes appear.

### Changing the authenticator app

Fortify has no "swap" for the second factor, and its undocumented `force` re-enable replaces the live secret and recovery codes before the new app is confirmed, which can lock the user out. The way to move to a new app or phone is Fortify's own: switch MFA off (behind the password confirmation above) and set it up again. An app that requires MFA should hold the session at its setup page until the new app is confirmed; `mfa.change-app-description` is there to explain that.

## API

### `useAuth()`

The app's authentication surface, wrapping nuxt-auth-sanctum so app code has one place to reach for:

|                                                                         |                                                                                                                                                |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `client`                                                                | The Sanctum fetch client — this is what most call sites want                                                                                   |
| `user`, `isAuthenticated`, `init`, `login`, `logout`, `refreshIdentity` | Passed through from `useSanctumAuth()`                                                                                                         |
| `loginWithoutRedirect(credentials)`                                     | Posts the credentials and returns the raw response, without fetching the identity or redirecting — both wrong while a second factor is pending |
| `loginRedirectTarget()`                                                 | Where to go after a successful login, following your Sanctum `redirect` config. `false` when the app opted out                                 |
| `userName`, `userInitials`                                              | Read off the payload's `name`, for avatars                                                                                                     |

`user` is typed as `{ data: AuthUser } | null`, and **`AuthUser` is an empty interface for your app to fill** by declaration merging. Put this anywhere in your app's types:

```ts
declare global {
  interface AuthUser extends User {}
}
```

Every `useAuth().user` in your app is then typed against your own payload, with no generics at the call sites. Anything specific to your backend — a `mfaEnabled` flag, roles, locale, an avatar URL — belongs in your app's own composable next to that type, not here.

### `useMfaDialog()`

|                                             |                                                                                                                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `openMfaEnableDialog()`                     | Opens `MfaDialog` on the enable flow: intro → QR code → confirm code → recovery codes                                                                                    |
| `openMfaDisableDialog()`                    | Opens `MfaDialog` on the disable confirmation                                                                                                                            |
| `closeMfaDialog()`                          |                                                                                                                                                                          |
| `openMfaRecoveryCodesDialog()`              | Fetches the current recovery codes, then shows them                                                                                                                      |
| `closeMfaRecoveryCodesDialog()`             |                                                                                                                                                                          |
| `mfaDialogRef`, `mfaRecoveryCodesDialogRef` | The underlying `Dialog` refs, if you need them                                                                                                                           |
| `loadingMfaRecoveryCodesDialog`             | Loading state for the button that opens the recovery codes. Only set while the codes load without a password prompt; with one, the prompt's Confirm button loads instead |

### `useMfa()`

The state and endpoint calls behind the components: `mfaStep`, `mfaCredentials`, `mfaError`, `qrCode`, `qrCodeUrl` (the `otpauth://` link in the QR code), `setupKey` (its secret), `recoveryCodes`, the `loading*` flags, and `enableMfa()`, `disableMfa()`, `getQrCode()`, `enterCode()`, `getRecoveryCodes()`, `generateRecoveryCodes()`, `solveMfaChallenge()`, `resetMfa()`.

Reach for it to build your own flow. For the standard one, `useMfaDialog()` plus the two dialogs is all you need.

### Components

| Component                                                             |                                                              |
| --------------------------------------------------------------------- | ------------------------------------------------------------ |
| `LoginForm`                                                           | Email + password sign-in, aware of a pending second factor   |
| `MfaDialog`                                                           | The enable/disable flow, all six steps. Emits `refresh`      |
| `MfaSetup`                                                            | The enable flow inline on a page, with an optional skip      |
| `MfaRecoveryCodesDialog`                                              | Shows and regenerates recovery codes                         |
| `MfaChallenge`                                                        | The second-factor form used by the challenge page            |
| `MfaCode`, `MfaRecoveryCode`                                          | The two inputs, with their validation and error region       |
| `MfaQr`, `MfaEnableResult`, `MfaDisableResult`, `MfaRecoveryCodeList` | Steps of the flow, reusable on their own                     |
| `MfaSetupKey`                                                         | The setup key as text, with a copy button                    |
| `AuthError`                                                           | Renders a Fortify error or validation payload                |
| `PasswordConfirmationDialog`                                          | Asks for the password when Fortify's `password.confirm` does |

`MfaQr` connects the authenticator app two ways. On a desktop the QR code leads, with the setup key behind a "can't scan?" toggle. On a phone (a coarse pointer below 480px), where the app is usually on the same device, a link that opens the app leads (the `otpauth://` link Fortify's QR code endpoint returns next to the SVG), then the setup key, with the QR code behind a toggle for another device. Apps that do not handle the link still have the key.

`MfaEnableResult` and `MfaRecoveryCodeList` take a `headingLevel` (2–4) for the "Recovery codes" heading at the top of the codes card: `MfaEnableResult` defaults to 2, and `MfaRecoveryCodeList` shows no heading without one, since a dialog about recovery codes already says so in its title. Pick the level one below the heading the codes sit under; `MfaSetup` uses 3.

## Translations

English and Dutch ship in `i18n/locales`, under the `mfa` and `password-confirmation` namespaces. `@nuxtjs/i18n` deep-merges the messages of every layer, so these arrive alongside your app's own namespaces without any configuration. Override a single string by declaring the same key in your app's locale file — the app's message wins.

The `mfa` namespace also holds the strings an app needs around these components — `mfa.setup-title` and `mfa.setup-description` for a setup page (`mfa.setup-required-description` when the user cannot skip it), `mfa.status-on`, `mfa.status-off` and `mfa.change-app-description` for an account settings page, `mfa.organization-required*` for an organization setting that requires MFA of every member — so every MFA string lives in one place.

The layer also uses `general.back`, `general.continue`, `general.confirm`, `general.done`, `general.sign-in`, `general.email`, `password.heading` and `password.show` from Krafters UI. The login _page_ strings — headings, descriptions, forgot-password copy — stay with your app, since only the form lives here.

Fortify returns its own validation messages untranslated; `AuthError` marks that region `lang="en"` so screen readers announce it in the right voice (WCAG 3.1.2).

## Accessibility

Built to WCAG 2.2 AA, like everything at Krafters:

- Each step moves focus deliberately — into the code input when the confirm step opens, and onto the other input when the user switches between an app code and a recovery code.
- The confirm button stays disabled until six digits are entered; the input declares `inputmode="numeric"`, `pattern`, `autocomplete="one-time-code"` and its own error message.
- Errors render in a `role="alert"` region.
- The QR code is exposed as `role="img"` with a translated name, and the written setup instructions sit beside it rather than only inside the image.
- Dialogs are native `<dialog>` elements from Krafters UI: modal focus trapping, `Escape` to close, and a labelled heading.
- `LoginForm`'s reveal-password button is a real toggle button carrying `aria-pressed`, not an icon that silently swaps meaning, and the fields declare `autocomplete="username"` / `"current-password"` (WCAG 1.3.5).

## Development

- Run `pnpm i` to install dependencies
- Run `pnpm run dev` to start the demo on [localhost:3004](http://localhost:3004)
- Run `pnpm run lint` before opening a pull request

`.playground` is a small demo app that extends this layer and Krafters UI. It has no backend, so the dialogs surface a fetch error when you submit — it exists to check layout, focus order and translations, and to give CI something to typecheck against.
