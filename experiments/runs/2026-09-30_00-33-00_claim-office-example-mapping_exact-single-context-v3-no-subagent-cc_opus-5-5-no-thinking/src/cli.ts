#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const STDIN = 0;

try {
  const scenario = JSON.parse(readFileSync(STDIN, "utf8"));
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
