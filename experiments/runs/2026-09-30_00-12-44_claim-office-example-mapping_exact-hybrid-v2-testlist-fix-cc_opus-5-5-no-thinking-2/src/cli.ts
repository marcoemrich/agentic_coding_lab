#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const STDIN_FD = 0;

try {
  const scenario: Scenario = JSON.parse(readFileSync(STDIN_FD, "utf8"));
  process.stdout.write(JSON.stringify(runScenario(scenario)) + "\n");
} catch (error) {
  process.stderr.write(`Error: ${(error as Error).message}\n`);
  process.exitCode = 1;
}
