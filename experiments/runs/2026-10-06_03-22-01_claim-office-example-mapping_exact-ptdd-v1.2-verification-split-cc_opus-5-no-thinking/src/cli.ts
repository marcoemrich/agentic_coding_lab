import { readFileSync } from "node:fs";

import { runScenario, type Scenario } from "./claim-office.js";

const FAILURE_EXIT_CODE = 1;

function readScenario(): Scenario {
  return JSON.parse(readFileSync(0, "utf8")) as Scenario;
}

function main(): void {
  try {
    const results = runScenario(readScenario());
    process.stdout.write(`${JSON.stringify({ results })}\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = FAILURE_EXIT_CODE;
  }
}

main();
