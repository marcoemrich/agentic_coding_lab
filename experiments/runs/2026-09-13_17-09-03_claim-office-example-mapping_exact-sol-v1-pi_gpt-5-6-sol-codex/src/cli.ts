#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

try {
  const input: unknown = JSON.parse(readFileSync(0, "utf8"));
  const output = processScenario(input);
  process.stdout.write(JSON.stringify(output));
} catch (error: unknown) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(description);
  process.exitCode = 1;
}
