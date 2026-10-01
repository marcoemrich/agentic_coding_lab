#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

try {
  const scenario = JSON.parse(readFileSync(0, "utf8"));
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
