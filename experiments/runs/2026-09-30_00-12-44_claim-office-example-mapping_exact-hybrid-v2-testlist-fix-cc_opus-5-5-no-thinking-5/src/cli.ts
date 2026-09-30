#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

const STDIN = 0;

try {
  const scenario: Scenario = JSON.parse(readFileSync(STDIN, "utf8"));
  process.stdout.write(JSON.stringify(processScenario(scenario)) + "\n");
} catch (error) {
  process.stderr.write(`Error: ${(error as Error).message}\n`);
  process.exitCode = 1;
}
