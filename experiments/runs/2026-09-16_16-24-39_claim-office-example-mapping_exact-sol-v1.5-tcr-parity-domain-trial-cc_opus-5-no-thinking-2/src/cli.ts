#!/usr/bin/env node
import { readFileSync } from "node:fs";

import { runScenario, type Scenario } from "./claim-office.js";

const EXIT_FAILURE = 1;

function readScenarioFromStdin(): Scenario {
  return JSON.parse(readFileSync(0, "utf8")) as Scenario;
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function main(): void {
  try {
    const results = runScenario(readScenarioFromStdin());
    process.stdout.write(`${JSON.stringify(results)}\n`);
  } catch (error) {
    process.stderr.write(`${describe(error)}\n`);
    process.exitCode = EXIT_FAILURE;
  }
}

main();
