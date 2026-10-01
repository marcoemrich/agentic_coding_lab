#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office";

// A rejected scenario produces no results: only an error description on stderr and a non-zero exit status.
function rejectScenario(error: unknown): void {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}

try {
  const scenario = JSON.parse(readFileSync(0, "utf8"));
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
} catch (error) {
  rejectScenario(error);
}
