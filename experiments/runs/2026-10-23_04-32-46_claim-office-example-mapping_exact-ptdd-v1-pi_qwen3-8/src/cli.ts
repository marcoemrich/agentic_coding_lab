#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office";

function main(): void {
  try {
    const input = readFileSync(0, "utf8");
    const scenario = JSON.parse(input) as Scenario;
    const result = processScenario(scenario);
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exit(1);
  }
}

main();
