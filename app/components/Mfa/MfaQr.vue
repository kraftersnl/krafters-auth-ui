<script setup lang="ts">
const { getQrCode, qrCode } = useMfa();

onMounted(() => getQrCode());
</script>

<template>
  <div class="mfa-qr-code-wrapper">
    <!-- role="img" so the inlined SVG is announced by its own name instead of
         having its paths walked; a bare aria-label on a generic div is not
         exposed by assistive technology. -->
    <div
      v-if="qrCode"
      role="img"
      :aria-label="$t('mfa.qr-code-alt')"
      class="qr-code-wrapper"
      v-html="qrCode"
    />

    <div class="qr-code-description">
      <h2>{{ $t('mfa.qr') }}</h2>
      <p>{{ $t('mfa.qr-description') }}</p>
    </div>
  </div>
</template>

<style>
.mfa-qr-code-wrapper {
  padding: 1.25rem;
  row-gap: 1.5rem;
  column-gap: 1.75rem;

  @media (min-width: 480px) {
    display: flex;
  }

  .qr-code-description {
    h2 {
      font-size: var(--font-size-md);
      margin-block-end: 0.5rem;
    }

    p {
      font-size: var(--font-size-sm);
      margin-block: 0;
      text-wrap: balance;
    }
  }

  .qr-code-wrapper {
    max-width: max-content;
    min-height: 192px;
    min-width: 192px;
    margin-inline: auto;

    svg {
      border-radius: var(--radius-sm);
      filter: contrast(1.5);
    }
  }
}
</style>
