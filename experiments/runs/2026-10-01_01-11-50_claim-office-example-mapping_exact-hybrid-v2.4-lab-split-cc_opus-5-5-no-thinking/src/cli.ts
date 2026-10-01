#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const STDIN_FD = 0;
const FAILURE_EXIT_CODE = 1;

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

try {
  const scenario: Scenario = JSON.parse(readFileSync(STDIN_FD, "utf8"));
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`Error: ${messageOf(error)}\n`);
  process.exitCode = FAILURE_EXIT_CODE;
}
