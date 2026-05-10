#!/usr/bin/env node
// Wrapper that runs the TypeScript CLI via tsx
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, "cli.ts");

const child = spawn(
  process.execPath,
  ["--import", "tsx/esm", cliPath],
  { stdio: "inherit" }
);

child.on("exit", (code) => process.exit(code ?? 0));
