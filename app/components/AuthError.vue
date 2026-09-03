<script setup lang="ts">
defineProps<{
  data?: AuthErrorData | null;
}>();
</script>

<template>
  <!-- Fortify returns its validation messages untranslated, so the region is
       marked as English for assistive technology (WCAG 3.1.2). -->
  <div lang="en" role="alert">
    <div v-if="data" class="auth-error">
      <ul v-if="data?.errors" role="list">
        <template v-for="(array, key) in data.errors" :key="key">
          <li v-for="message in array" :key="message">{{ message }}</li>
        </template>
      </ul>

      <p v-else-if="data?.message">{{ data.message }}</p>
    </div>
  </div>
</template>

<style>
/*
 * Styled by the layer rather than reusing the host app's `.error-message`:
 * that class is defined by each app's own error component, whose CSS chunk is
 * not necessarily loaded on the page a login form sits on, and two global
 * definitions of one class would resolve by source order. Written entirely in
 * Krafters UI tokens, so it still picks up the app's palette and dark mode.
 * Override it from the app with `.auth-error`.
 */
.auth-error {
  margin-inline: auto;
  overflow-wrap: anywhere;
  max-width: fit-content;
  margin-block-start: 1.5rem;
  padding-inline: 1.25rem;
  padding-block: 1rem;
  border-radius: var(--radius-md);
  color: var(--color-red-text);
  border: 1px solid var(--color-red-bg);
  background-color: var(--color-white);

  p,
  ul {
    font-size: var(--font-size-xs);
    margin-block: 0;
  }
}
</style>
