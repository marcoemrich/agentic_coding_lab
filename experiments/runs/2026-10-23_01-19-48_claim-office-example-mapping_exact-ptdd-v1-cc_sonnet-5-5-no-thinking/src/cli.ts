#!/usr/bin/env tsx
import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const STDIN = 0;
const FAILURE_EXIT_CODE = 1;

try {
  const scenario = JSON.parse(readFileSync(STDIN, "utf8"));
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(FAILURE_EXIT_CODE);
}
