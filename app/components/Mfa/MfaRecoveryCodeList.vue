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
    /*
     * Fortify recovery codes are always 21 characters, so in this monospace
     * font 21ch is exactly one code: two columns when two codes fit side by
     * side, one otherwise, and never a code broken across lines.
     */
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 21ch), 1fr));
    column-gap: 1rem;
    text-align: center;
    white-space: nowrap;
    font-family: monospace;
    font-size: var(--auth-font-size-recovery-code-list, var(--font-size-sm));
    color: var(--color-grey-text);
  }

  .copy-button {
    --font-size: var(--auth-font-size-dialog-button, var(--font-size-sm));
    margin-block-start: 1rem;
  }
}
</style>
