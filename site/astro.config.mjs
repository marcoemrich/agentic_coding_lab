import react from "@astrojs/react";
import yaml from "@rollup/plugin-yaml";
import { defineConfig } from "astro/config";

// Static pages from the exported lab data under src/data/ (experiments/export-site-data.py).
export default defineConfig({
  integrations: [react()],
  vite: { plugins: [yaml()] },
});
