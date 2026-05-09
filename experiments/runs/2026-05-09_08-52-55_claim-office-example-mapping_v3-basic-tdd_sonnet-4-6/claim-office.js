#!/usr/bin/env node
// This file is a wrapper that invokes the CLI with tsx for TypeScript support
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tsxBin = join(__dirname, "node_modules", ".bin", "tsx");
const cliPath = join(__dirname, "src", "cli.ts");

const result = spawnSync(tsxBin, [cliPath], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
