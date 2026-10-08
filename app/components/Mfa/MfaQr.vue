<script setup lang="ts">
const { getQrCode, qrCode } = useMfa();

onMounted(() => getQrCode());
</script>

<template>
  <div class="mfa-qr-code-wrapper">
    <!-- role="img" so the inlined SVG is announced by its own name instead of
         having its paths walked; a bare aria-label on a generic div is not
         exposed by assistive technology. The wrapper renders before the code
         arrives so its minimum size holds the space; it only becomes an image
         once there is one. -->
    <div
      :role="qrCode ? 'img' : undefined"
      :aria-label="qrCode ? $t('mfa.qr-code-alt') : undefined"
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
  display: grid;
  padding: 1rem;
  row-gap: 1.5rem;
  column-gap: 1.75rem;

  @media (min-width: 480px) {
    display: flex;
  }

  .qr-code-description {
    text-align: center;

    @media (min-width: 480px) {
      text-align: left;
    }

    h2 {
      font-size: var(--auth-font-size-label, var(--font-size-md));
      margin-block-end: 0.5rem;
    }

    p {
      font-size: var(--auth-font-size-small, var(--font-size-sm));
      margin-block: 0;
      text-wrap: balance;
    }
  }

  .qr-code-wrapper {
    display: grid;
    border-radius: var(--radius-sm);
    background-color: var(--color-bg);
    max-width: max-content;
    min-height: 192px;
    max-height: 192px;
    min-width: 192px;
    max-width: 192px;
    margin-inline: auto;

    svg {
      border-radius: var(--radius-sm);
      filter: contrast(1.5);
    }
  }
}
</style>
