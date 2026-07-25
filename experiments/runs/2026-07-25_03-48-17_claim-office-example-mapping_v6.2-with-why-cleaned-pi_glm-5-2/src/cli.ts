#!/usr/bin/env node
// MHPCO Claim Office CLI: reads a scenario JSON from stdin, writes results JSON to stdout.
// On any error it writes a description to stderr and exits non-zero (no stdout output).

import { readFileSync } from "node:fs";
import { runScenario } from "./office.js";

function main(): void {
  const input = readFileSync(0, "utf-8");
  const scenario = JSON.parse(input);
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
