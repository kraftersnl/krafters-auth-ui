<script setup lang="ts">
const { recoveryCodes } = useMfa();
</script>

<template>
  <div>
    <p>{{ $t('mfa.recovery-code-description') }}</p>

    <Card class="mfa-recovery-codes-card">
      <ul role="list">
        <li v-for="code in recoveryCodes" :key="code">{{ code }}</li>
      </ul>

      <CopyButton
        :text="recoveryCodes.join('\n')"
        :hide-label="false"
        :label="$t('mfa.recovery-codes-copy')"
      />
    </Card>
  </div>
</template>

<style>
.mfa-recovery-codes-card {
  margin-inline: auto;

  ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 1.5rem;
    text-align: center;
    font-family: monospace;
    font-size: var(--font-size-sm);
    color: var(--color-grey-text);
  }

  .copy-button {
    margin-block-start: 1rem;
  }
}
</style>
