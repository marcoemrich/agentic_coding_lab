import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["src/**/*.ts"],
    ignores: ["src/**/*.spec.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      sonarjs,
    },
    rules: {
      // Complexity smells
      "sonarjs/cognitive-complexity": ["error", 10],
      "max-depth": ["error", 3],
      "max-lines-per-function": ["error", { max: 30, skipBlankLines: true, skipComments: true }],
      "max-params": ["error", 4],

      // Duplication smells
      "sonarjs/no-duplicate-string": ["error", { threshold: 3 }],
      "sonarjs/no-duplicated-branches": "error",
      "sonarjs/no-identical-functions": "error",

      // Dead code smells
      "no-unused-vars": "off",
      "sonarjs/no-unused-collection": "error",
      "no-unreachable": "error",

      // Magic numbers
      "no-magic-numbers": ["error", { ignore: [0, 1, -1], ignoreArrayIndexes: true }],

      // Boolean/logic smells
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-gratuitous-expressions": "error",

      // Code quality smells
      "sonarjs/no-collapsible-if": "error",
      "sonarjs/no-redundant-jump": "error",
      "sonarjs/no-useless-catch": "error",
      "sonarjs/prefer-immediate-return": "error",
      "sonarjs/prefer-single-boolean-return": "error",

      // Nested complexity
      "sonarjs/no-nested-switch": "error",
      "sonarjs/no-nested-template-literals": "error",
    },
  },
];
