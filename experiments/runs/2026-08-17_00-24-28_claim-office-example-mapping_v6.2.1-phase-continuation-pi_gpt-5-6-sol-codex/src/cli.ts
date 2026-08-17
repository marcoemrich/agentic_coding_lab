#!/usr/bin/env -S node --import tsx
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

try {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
