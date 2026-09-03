<script setup lang="ts">
defineProps<{
  data?: MfaErrorData | null;
}>();
</script>

<template>
  <!-- Fortify returns its validation messages untranslated, so the region is
       marked as English for assistive technology (WCAG 3.1.2). -->
  <div lang="en" role="alert">
    <div v-if="data" class="error-message">
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
.error-message {
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

  h2 {
    font-size: var(--font-size-md);
    margin-block-end: 0.5rem;
  }
}
</style>
