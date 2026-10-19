#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

function main(): void {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input);
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output));
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(message + "\n");
  process.exit(1);
}