#!/usr/bin/env -S node --import tsx
import { processScenario, type Scenario } from "./claim-office.js";

async function main(): Promise<void> {
  try {
    let input = "";
    for await (const chunk of process.stdin) input += String(chunk);
    const scenario = JSON.parse(input) as Scenario;
    process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exitCode = 1;
  }
}

void main();
