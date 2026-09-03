<script setup lang="ts">
useHead({ title: 'Login' });

// Shared with a sibling forgot-password form in a real app.
const email = ref('');
</script>

<template>
  <div class="demo-page">
    <h1>LoginForm</h1>

    <p>
      Left: the defaults, as the Cardan Auditor login page renders them. Right:
      the same component with the slots and props the Cardan LMS app needs.
      Neither can reach a backend here, so submitting surfaces a fetch error —
      which is a useful way to check the error region and the shake animation.
    </p>

    <div class="demo-cols">
      <Card background-color="white" class="demo-login-card">
        <h2>Defaults</h2>

        <LoginForm v-model:email="email" />
      </Card>

      <Card background-color="white" class="demo-login-card">
        <h2>LMS, via slots</h2>

        <LoginForm
          :show-password-toggle="false"
          :divider="false"
          remember
          error-position="below-submit"
          :loading-delay="lgTransition"
        >
          <template #submit="{ submitting }">
            <Button
              type="submit"
              :label="$t('general.sign-in')"
              icon="material-symbols:arrow-right-alt"
              icon-pos="end"
              :loading="submitting"
              variant="black"
              font-size="xs"
            />
          </template>
        </LoginForm>
      </Card>
    </div>

    <p class="demo-note">Bound email: {{ email || '(empty)' }}</p>
  </div>
</template>

<style>
.demo-page {
  .demo-cols {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-block-start: 2rem;

    > * {
      flex-grow: 1;
      flex-basis: 320px;
      max-width: 420px;
    }
  }

  .demo-login-card {
    h2 {
      font-size: var(--font-size-md);
      margin-block-start: 0;
      margin-block-end: 1rem;
    }
  }

  .demo-note {
    margin-block-start: 2rem;
    color: var(--color-grey-text);
    font-size: var(--font-size-sm);
  }
}
</style>
