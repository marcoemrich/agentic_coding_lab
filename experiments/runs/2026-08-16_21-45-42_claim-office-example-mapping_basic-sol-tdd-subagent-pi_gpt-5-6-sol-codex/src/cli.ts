#!/usr/bin/env -S node --import tsx
import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

try {
  const scenario: unknown = JSON.parse(readFileSync(0, "utf8"));
  process.stdout.write(JSON.stringify(runScenario(scenario as Parameters<typeof runScenario>[0])));
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${errorMessage}\n`);
  process.exitCode = 1;
}
