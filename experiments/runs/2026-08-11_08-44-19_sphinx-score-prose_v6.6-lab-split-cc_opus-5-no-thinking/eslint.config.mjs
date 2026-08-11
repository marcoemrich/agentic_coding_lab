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
      "@typescript-eslint": tseslint.plugin,
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

      // Magic numbers. The type-aware variant is used so that numeric literal
      // *types* (e.g. `rank?: 1 | 2 | 3`, straight from the spec's JSON schema)
      // are not reported as magic values. Same thresholds as the base rule.
      "no-magic-numbers": "off",
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignore: [0, 1, -1],
          ignoreArrayIndexes: true,
          ignoreNumericLiteralTypes: true,
          ignoreTypeIndexes: true,
        },
      ],

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
