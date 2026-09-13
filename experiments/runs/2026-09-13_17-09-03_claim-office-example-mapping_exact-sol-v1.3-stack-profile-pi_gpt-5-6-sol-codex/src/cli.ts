#!/usr/bin/env -S pnpm exec tsx
import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

try {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(JSON.stringify(processScenario(scenario)));
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
