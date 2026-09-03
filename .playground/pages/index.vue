<script setup lang="ts">
useHead({ title: 'Demo' });

const {
  openMfaEnableDialog,
  openMfaDisableDialog,
  openMfaRecoveryCodesDialog,
} = useMfaDialog();
</script>

<template>
  <div class="demo-page">
    <h1>Krafters Auth UI</h1>

    <p>
      The dialogs below call the Fortify endpoints of the app that extends this
      layer, so they surface an error here. Use the demo to check layout, focus
      order and translations.
    </p>

    <div class="demo-buttons">
      <Button
        variant="outline"
        size="lg"
        icon="material-symbols:shield-lock-outline-rounded"
        label="Enable MFA"
        @click="openMfaEnableDialog()"
      />

      <Button
        variant="outline"
        size="lg"
        icon="material-symbols:shield-lock-outline-rounded"
        label="Disable MFA"
        @click="openMfaDisableDialog()"
      />

      <Button
        variant="outline"
        size="lg"
        icon="material-symbols:password-rounded"
        label="Recovery codes"
        @click="openMfaRecoveryCodesDialog()"
      />

      <Button
        variant="link"
        size="lg"
        label="Sign-in challenge"
        to="/two-factor-authentication"
      />
    </div>

    <MfaDialog />

    <MfaRecoveryCodesDialog />
  </div>
</template>

<style>
.demo-page {
  .demo-buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin-block-start: 2rem;
  }
}
</style>
