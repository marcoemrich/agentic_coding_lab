#!/usr/bin/env -S node --import tsx
import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

function runClaimOfficeCli(): void {
  try {
    const input = readFileSync(0, "utf8");
    const scenario = JSON.parse(input) as Scenario;
    process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exitCode = 1;
  }
}

runClaimOfficeCli();
