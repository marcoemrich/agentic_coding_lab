#!/usr/bin/env node
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use tsx to run the TypeScript source
import { spawn } from "child_process";
const tsx = join(__dirname, "../node_modules/.bin/tsx");
const cli = join(__dirname, "../src/cli.ts");

const proc = spawn(tsx, [cli], { stdio: "inherit" });
proc.on("exit", (code) => process.exit(code ?? 0));
