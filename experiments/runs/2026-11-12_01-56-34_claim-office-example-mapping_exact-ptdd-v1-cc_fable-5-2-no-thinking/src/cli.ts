#!/usr/bin/env -S npx tsx
import { text } from "node:stream/consumers";
import { processScenario } from "./claim-office.js";

function errorDescription(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

try {
  const scenario = JSON.parse(await text(process.stdin));
  process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
} catch (error) {
  process.stderr.write(`${errorDescription(error)}\n`);
  process.exitCode = 1;
}
