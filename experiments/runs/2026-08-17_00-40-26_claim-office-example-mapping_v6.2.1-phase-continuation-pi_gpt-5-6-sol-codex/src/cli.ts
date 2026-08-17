#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

try {
  const scenario: unknown = JSON.parse(readFileSync(0, "utf8"));
  process.stdout.write(JSON.stringify(processScenario(scenario)));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
