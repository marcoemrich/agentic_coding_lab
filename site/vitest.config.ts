import yaml from "@rollup/plugin-yaml";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Pure logic runs in node; rendered components (*.spec.tsx) run in happy-dom
// with Testing Library, which needs an explicit cleanup without vitest globals.
export default defineConfig({
  plugins: [react(), yaml()],
  test: {
    projects: [
      {
        extends: true,
        test: { name: "unit", environment: "node", include: ["src/**/*.spec.ts"] },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "happy-dom",
          include: ["src/**/*.spec.tsx"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});
