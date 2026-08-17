#!/usr/bin/env -S node --import tsx
import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

try {
  const input: unknown = JSON.parse(readFileSync(0, "utf8"));
  process.stdout.write(`${JSON.stringify(processScenario(input))}\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
