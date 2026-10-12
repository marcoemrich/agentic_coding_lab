import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

// Zero thresholds report each non-trivial function without treating it as a smell.
export default [{
  files: ["src/**/*.{ts,tsx}"],
  ignores: ["src/**/*.spec.{ts,tsx}"],
  languageOptions: { parser: tseslint.parser, parserOptions: { projectService: true } },
  plugins: { sonarjs },
  rules: {
    complexity: ["warn", 0],
    "sonarjs/cognitive-complexity": ["warn", 0],
  },
}];
