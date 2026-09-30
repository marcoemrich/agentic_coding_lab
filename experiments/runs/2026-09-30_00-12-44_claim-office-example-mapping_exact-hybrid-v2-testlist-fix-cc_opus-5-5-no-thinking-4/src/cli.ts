#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

const STDIN = 0;

// Success: JSON result on stdout. Failure: message on stderr, non-zero exit, empty stdout.
try {
  const scenario: Scenario = JSON.parse(readFileSync(STDIN, "utf8"));
  const result = processScenario(scenario);
  process.stdout.write(`${JSON.stringify(result)}\n`);
} catch (error) {
  process.stderr.write(`Error: ${(error as Error).message}\n`);
  process.exitCode = 1;
}
