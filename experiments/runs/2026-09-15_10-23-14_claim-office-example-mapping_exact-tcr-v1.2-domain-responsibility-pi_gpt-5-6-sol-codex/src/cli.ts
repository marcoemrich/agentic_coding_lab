#!/usr/bin/env -S node --import tsx
import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

try {
  const input = JSON.parse(readFileSync(0, "utf8")) as Parameters<typeof processScenario>[0];
  process.stdout.write(JSON.stringify(processScenario(input)));
} catch (error) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
}
