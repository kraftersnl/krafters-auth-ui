<script setup lang="ts">
useHead({ title: 'MFA setup' });

const status = ref('');
</script>

<template>
  <div class="demo-page">
    <h1>{{ $t('mfa.setup-title') }}</h1>

    <p>{{ $t('mfa.setup-description') }}</p>

    <MfaSetup
      @skip="status = 'Skipped'"
      @done="status = 'Done'"
      @refresh="status = 'MFA turned on'"
    />

    <p role="status">{{ status }}</p>

    <Button variant="link" size="lg" label="Back to demo" to="/" />
  </div>
</template>
