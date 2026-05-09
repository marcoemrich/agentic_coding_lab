import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["src/**/*.ts"],
    ignores: ["src/**/*.spec.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { projectService: true },
    },
    plugins: { sonarjs },
    rules: {
      "complexity": ["warn", 0],
      "sonarjs/cognitive-complexity": ["warn", 0],
    },
  },
];
