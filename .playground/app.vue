<script setup lang="ts">
useHead({ titleTemplate: '%s | Krafters Auth UI' });
</script>

<template>
  <div class="app">
    <NuxtRouteAnnouncer />

    <header class="app-header">
      <ThemeSwitch />
    </header>

    <main id="main" tabindex="-1">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
:root {
  --font-family: system-ui, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 600;
  --line-height: 1.5;
  --line-height-heading: 1.2;
}

.app-header {
  display: flex;
  justify-content: flex-end;
  padding-inline: 1.5rem;
  padding-block-start: 1rem;
  max-width: 1024px;
  margin-inline: auto;
}

main {
  container-type: inline-size;
  padding-inline: 1.5rem;
  padding-block: 2.5rem;
  max-width: 1024px;
  margin-inline: auto;
}
</style>
