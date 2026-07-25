#!/usr/bin/env -S node --import tsx
// MHPCO Claim Office CLI: reads a scenario JSON from stdin, writes results JSON to stdout.
import { processScenario, type Scenario } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (chunk: string) => {
  input += chunk;
});
process.stdin.on("end", () => {
  try {
    const scenario = JSON.parse(input) as Scenario;
    const results = processScenario(scenario);
    process.stdout.write(JSON.stringify({ results }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
});
