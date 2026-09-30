#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const errorMessageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

try {
  const scenario = JSON.parse(readFileSync(0, "utf8"));
  process.stdout.write(JSON.stringify(runScenario(scenario)) + "\n");
} catch (error) {
  process.stderr.write(`Error: ${errorMessageOf(error)}\n`);
  process.exitCode = 1;
}
