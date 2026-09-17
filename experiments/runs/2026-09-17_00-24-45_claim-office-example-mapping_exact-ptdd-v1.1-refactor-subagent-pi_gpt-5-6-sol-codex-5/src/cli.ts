#!/usr/bin/env -S node --import tsx
import { runScenario, type Scenario } from "./claim-office.js";

function processScenarioDocument(input: string): string {
  return JSON.stringify(runScenario(JSON.parse(input) as Scenario));
}

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk: string) => { input += chunk; });
process.stdin.on("end", () => {
  try {
    process.stdout.write(`${processScenarioDocument(input)}\n`);
  } catch (error) {
    const description = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${description}\n`);
    process.exitCode = 1;
  }
});
