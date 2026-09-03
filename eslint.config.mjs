import withNuxt from './.playground/.nuxt/eslint.config.mjs';

export default withNuxt()
  .override('nuxt/vue/rules', {
    rules: {
      'vue/no-v-html': 'off',
      'vue/html-self-closing': 'off',
      'vue/multi-word-component-names': 'off',
    },
  })
  .override('nuxt/typescript/rules', {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  });
