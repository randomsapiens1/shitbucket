import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  // Base JS recommended rules
  js.configs.recommended,

  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    settings: {
      react: { version: "detect" },
    },

    rules: {
      // ── React ──────────────────────────────────────────────────────
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",   // not needed with Next.js
      "react/prop-types": "off",            // no PropTypes in this project
      "react/self-closing-comp": "warn",
      "react/jsx-no-useless-fragment": "warn",

      // ── Variables ──────────────────────────────────────────────────
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "prefer-const":   "warn",
      "no-var":         "error",

      // ── Code quality ───────────────────────────────────────────────
      "no-console":           ["warn", { allow: ["error", "warn"] }],
      "no-duplicate-imports": "error",
      "eqeqeq":               ["error", "always", { null: "ignore" }],
    },
  },
];
