import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default [{
  files: ["src/**/*.{ts,tsx}"],
  ignores: ["src/**/*.spec.{ts,tsx}"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { projectService: true },
  },
  plugins: { sonarjs },
  rules: {
    "sonarjs/cognitive-complexity": ["error", 10],
    "max-depth": ["error", 3],
    "max-lines-per-function": ["error", { max: 30, skipBlankLines: true, skipComments: true }],
    "max-params": ["error", 4],
    "sonarjs/no-duplicate-string": ["error", { threshold: 3 }],
    "sonarjs/no-duplicated-branches": "error",
    "sonarjs/no-identical-functions": "error",
    "no-unused-vars": "off",
    "sonarjs/no-unused-collection": "error",
    "no-unreachable": "error",
    "no-magic-numbers": ["error", { ignore: [0, 1, -1], ignoreArrayIndexes: true }],
    "sonarjs/no-redundant-boolean": "error",
    "sonarjs/no-gratuitous-expressions": "error",
    "sonarjs/no-collapsible-if": "error",
    "sonarjs/no-redundant-jump": "error",
    "sonarjs/no-useless-catch": "error",
    "sonarjs/prefer-immediate-return": "error",
    "sonarjs/prefer-single-boolean-return": "error",
    "sonarjs/no-nested-switch": "error",
    "sonarjs/no-nested-template-literals": "error",
  },
}];
