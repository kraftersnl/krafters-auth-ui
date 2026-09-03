# Krafters Auth UI

Accessible multi-factor authentication UX for [Nuxt](https://nuxt.com) SPAs backed by [Laravel Fortify](https://laravel.com/docs/fortify), in TypeScript.

Krafters Auth UI is a [Nuxt Layer](https://nuxt.com/docs/getting-started/layers) in a public repository. It ships the whole MFA flow — enable, scan, confirm, recovery codes, disable, and the second-factor step at sign-in — so each app wires up two dialogs and a page instead of rebuilding it.

## Dependencies

This layer does **not** stand on its own. Extend it alongside its two dependencies:

| Dependency                                                            | Why                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Krafters UI](https://github.com/kraftersnl/krafters-ui)              | Supplies every component used here (`Button`, `Card`, `Dialog`, `Form`, `Input`, `CopyButton`), the `@nuxtjs/i18n` / `@nuxt/icon` / `@nuxtjs/color-mode` module setup, and the **design tokens** all styling in this layer is written against. Extend it as a layer — a peer of this one, not a nested dependency. |
| [nuxt-auth-sanctum](https://github.com/manchenkoff/nuxt-auth-sanctum) | Provides `useSanctumClient()` and `useSanctumAuth()`, which this layer calls for the Fortify endpoints, plus the `sanctum:guest` middleware the challenge page uses. Install it as a module in your app.                                                                                                           |

### Design tokens

Every rule in this layer styles with Krafters UI token _names_ — the colors, font sizes and radii Krafters UI documents:

`--color-text` · `--color-grey-text` · `--color-card-bg` · `--color-white` · `--color-red-text` · `--color-red-bg` · `--color-green-graphic` · `--font-size-sm|md|lg|xl|xxl|xxxl` · `--font-weight-bold` · `--radius-sm|md`

Krafters UI defines default values for these in its `app/assets/main.css`, but that file is a template rather than an auto-loaded stylesheet — each app keeps its own palette under those names, exactly as it already does for Krafters UI components. If your app renders Krafters UI correctly, this layer inherits the same theming, dark mode included, with no extra CSS.

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

| Endpoint                                        | Method            | Used for                         |
| ----------------------------------------------- | ----------------- | -------------------------------- |
| `/api/user/two-factor-authentication`           | `POST` / `DELETE` | Enable / disable MFA             |
| `/api/user/two-factor-qr-code`                  | `GET`             | The setup QR code (inline SVG)   |
| `/api/user/confirmed-two-factor-authentication` | `POST`            | Confirm the first code           |
| `/api/user/two-factor-recovery-codes`           | `GET` / `POST`    | Read / regenerate recovery codes |
| `/api/two-factor-challenge`                     | `POST`            | Second factor at sign-in         |

Enable Fortify's `two-factor-authentication` feature with `confirm: true`, and expose whether MFA is on for the current user in your `/api/user` payload.

## Usage

### Sign-in challenge

The layer registers the page **`/two-factor-authentication`** for you. Send the user there when Fortify answers your login request with `two_factor: true`, keeping the route they were heading for:

```ts
const response = await login({ email, password });

if (response.two_factor) {
  return navigateTo({
    path: '/two-factor-authentication',
    query: { redirect: route.query.redirect },
  });
}
```

The page reads that `?redirect=` and continues there once the second factor is accepted. It offers a recovery code as an alternative to the app code, and renders inside your app's default layout.

To place the challenge somewhere else — a different route, a bespoke layout — create your own page (a page in your app wins over the layer's) and render `<MfaChallenge />` in it.

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

Whether MFA is currently on stays your app's call — the flag lives in your `/api/user` response, and its name differs per backend, so the layer never guesses at it.

## API

### `useMfaDialog()`

|                                             |                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `openMfaEnableDialog()`                     | Opens `MfaDialog` on the enable flow: intro → QR code → confirm code → recovery codes |
| `openMfaDisableDialog()`                    | Opens `MfaDialog` on the disable confirmation                                         |
| `closeMfaDialog()`                          |                                                                                       |
| `openMfaRecoveryCodesDialog()`              | Fetches the current recovery codes, then shows them                                   |
| `closeMfaRecoveryCodesDialog()`             |                                                                                       |
| `mfaDialogRef`, `mfaRecoveryCodesDialogRef` | The underlying `Dialog` refs, if you need them                                        |

### `useMfa()`

The state and endpoint calls behind the components: `mfaStep`, `mfaCredentials`, `mfaError`, `qrCode`, `recoveryCodes`, the `loading*` flags, and `enableMfa()`, `disableMfa()`, `getQrCode()`, `enterCode()`, `getRecoveryCodes()`, `generateRecoveryCodes()`, `solveMfaChallenge()`, `resetMfa()`.

Reach for it to build your own flow. For the standard one, `useMfaDialog()` plus the two dialogs is all you need.

### Components

| Component                                                             |                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------- |
| `MfaDialog`                                                           | The enable/disable flow, all six steps. Emits `refresh` |
| `MfaRecoveryCodesDialog`                                              | Shows and regenerates recovery codes                    |
| `MfaChallenge`                                                        | The second-factor form used by the challenge page       |
| `MfaCode`, `MfaRecoveryCode`                                          | The two inputs, with their validation and error region  |
| `MfaQr`, `MfaEnableResult`, `MfaDisableResult`, `MfaRecoveryCodeList` | Steps of the flow, reusable on their own                |
| `MfaError`                                                            | Renders a Fortify error or validation payload           |

## Translations

English and Dutch ship in `i18n/locales`, under the `mfa` namespace. `@nuxtjs/i18n` deep-merges the messages of every layer, so these arrive alongside your app's own namespaces without any configuration. Override a single string by declaring the same key in your app's locale file — the app's message wins.

The layer also uses `general.continue`, `general.confirm`, `general.done` and `general.sign-in` from Krafters UI.

Fortify returns its own validation messages untranslated; `MfaError` marks that region `lang="en"` so screen readers announce it in the right voice (WCAG 3.1.2).

## Accessibility

Built to WCAG 2.2 AA, like everything at Krafters:

- Each step moves focus deliberately — into the code input when the confirm step opens, and onto the other input when the user switches between an app code and a recovery code.
- The confirm button stays disabled until six digits are entered; the input declares `inputmode="numeric"`, `pattern`, `autocomplete="one-time-code"` and its own error message.
- Errors render in a `role="alert"` region.
- The QR code is exposed as `role="img"` with a translated name, and the written setup instructions sit beside it rather than only inside the image.
- Dialogs are native `<dialog>` elements from Krafters UI: modal focus trapping, `Escape` to close, and a labelled heading.

## Development

- Run `pnpm i` to install dependencies
- Run `pnpm run dev` to start the demo on [localhost:3004](http://localhost:3004)
- Run `pnpm run lint` before opening a pull request

`.playground` is a small demo app that extends this layer and Krafters UI. It has no backend, so the dialogs surface a fetch error when you submit — it exists to check layout, focus order and translations, and to give CI something to typecheck against.
