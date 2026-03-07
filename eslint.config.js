/**
 * ESLint flat config — minimal setup for the custom component-enforcement rule.
 * Standard linting & formatting is handled by Biome.
 *
 * Run:  bun run lint:eslint
 */

import solid from "eslint-plugin-solid";
import tseslint from "typescript-eslint";
import customPlugin from "./eslint-plugins/no-native-interactive-elements.js";

export default [
  {
    files: ["src/**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      solid,
      custom: customPlugin,
    },
    rules: {
      "solid/reactivity": "warn",
      "solid/no-destructure": "warn",
      "solid/jsx-no-undef": "error",
      "custom/no-native-interactive-elements": "error",
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
];
