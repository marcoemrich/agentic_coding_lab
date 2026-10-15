import react from "@astrojs/react";
import yaml from "@rollup/plugin-yaml";
import { defineConfig } from "astro/config";
import { SITE_BASE } from "./src/site-base.ts";

// Static pages from the exported lab data under src/data/ (experiments/export-site-data.py).
export default defineConfig({
  base: SITE_BASE,
  integrations: [react()],
  vite: { plugins: [yaml()] },
});
