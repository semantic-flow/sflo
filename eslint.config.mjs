// eslint.config.mjs
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    // Ignore patterns
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/*.d.ts",
      "docs/**",
      "documentation/**",
      ".next/**",
    ],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // Code style rules
      "quote-props": ["error", "always"],
      "quotes": ["error", "double"],

      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
      }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-var-requires": "error",

      // General rules
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
