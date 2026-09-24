#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claimOffice.js";

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
} catch (error) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
}
