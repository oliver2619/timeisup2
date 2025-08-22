// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "tiu",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "tiu",
          style: "kebab-case",
        },
      ],
      "@angular-eslint/no-input-rename": ["off"],
      "@angular-eslint/no-output-rename": ["off"],
      "@typescript-eslint/no-unused-vars": ["error", {"argsIgnorePattern": "^_"}],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/elements-content": ["off"],
      "@angular-eslint/template/label-has-associated-control": ["off"],
      "@angular-eslint/template/click-events-have-key-events": ["off"],
      "@angular-eslint/template/interactive-supports-focus": ["off"],
    },
  }
);
