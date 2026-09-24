#!/usr/bin/env -S tsx
import { readFileSync } from "node:fs";
import { executeScenario, type Scenario } from "./claim-office.js";

function main(): void {
  try {
    const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
    process.stdout.write(`${JSON.stringify(executeScenario(scenario))}\n`);
  } catch (error) {
    const description = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${description}\n`);
    process.exitCode = 1;
  }
}

main();
