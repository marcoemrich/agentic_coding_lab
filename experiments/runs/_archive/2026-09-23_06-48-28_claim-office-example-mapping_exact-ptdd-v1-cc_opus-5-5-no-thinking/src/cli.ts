#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claimOffice.js";

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
} catch (error) {
  process.stderr.write(`Error: ${(error as Error).message}\n`);
  process.exitCode = 1;
}
