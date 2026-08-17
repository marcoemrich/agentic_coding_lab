import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";

export default tseslint.config({
  files: ["**/*.ts"],
  languageOptions: { parser: tseslint.parser },
  plugins: { sonarjs },
  rules: {
    "complexity": ["warn", 0],
    "sonarjs/cognitive-complexity": ["warn", 0],
  },
});
