#!/usr/bin/env tsx
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claimOffice.js";

const REJECTED_SCENARIO_EXIT_STATUS = 1;

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = REJECTED_SCENARIO_EXIT_STATUS;
}
