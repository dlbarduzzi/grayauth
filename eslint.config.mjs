import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

export default tseslint.config({
  files: ["**/*.ts", "**/*.tsx"],
  ignores: ["node_modules/**"],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    ...tseslint.configs.recommended,
  ],
  languageOptions: {
    ecmaVersion: "latest",
    parserOptions: {
      project: ["./tsconfig.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    quotes: ["error", "double"],
    "no-empty": "error",
    "max-len": ["error", { code: 88 }],
    "prefer-const": "error",
    "no-process-env": "error",
    "no-process-exit": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-expressions": "error",
    "@typescript-eslint/consistent-type-definitions": "off",
  },
})
