// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "vue/html-self-closing": "off",
    "vue/no-multiple-template-root": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
});
