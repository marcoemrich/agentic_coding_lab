#!/usr/bin/env tsx
import { readFileSync } from "node:fs";
import { ClaimOfficeError } from "./claim-office-error.js";
import { runScenario, type Scenario } from "./scenario.js";

function parseScenario(text: string): Scenario {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new ClaimOfficeError(`Invalid JSON input: ${(error as Error).message}`);
  }
}

try {
  const scenario = parseScenario(readFileSync(0, "utf8"));
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  if (!(error instanceof ClaimOfficeError)) {
    throw error;
  }
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
