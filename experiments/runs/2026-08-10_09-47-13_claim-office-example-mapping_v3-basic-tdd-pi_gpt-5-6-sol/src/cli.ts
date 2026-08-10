#!/usr/bin/env -S node --import tsx
import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

try {
  const input = JSON.parse(readFileSync(0, "utf8")) as unknown;
  process.stdout.write(`${JSON.stringify(processScenario(input))}\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`claim-office: ${message}\n`);
  process.exitCode = 1;
}
