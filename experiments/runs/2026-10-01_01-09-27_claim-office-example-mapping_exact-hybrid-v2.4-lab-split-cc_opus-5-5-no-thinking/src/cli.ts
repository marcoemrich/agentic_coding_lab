#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

try {
  const scenario = JSON.parse(readFileSync(0, "utf8"));
  process.stdout.write(JSON.stringify(runScenario(scenario)) + "\n");
} catch (error) {
  process.stderr.write(`${String(error)}\n`);
  process.exitCode = 1;
}
