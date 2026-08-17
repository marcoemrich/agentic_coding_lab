#!/usr/bin/env -S node --import tsx
import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

try {
  const scenario: unknown = JSON.parse(readFileSync(0, "utf8"));
  const output = processScenario(scenario as Parameters<typeof processScenario>[0]);
  process.stdout.write(JSON.stringify(output));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
