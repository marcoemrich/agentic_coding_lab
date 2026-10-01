import { readFileSync } from "node:fs";

import { runScenario, type Scenario } from "./claim-office.js";

const EXIT_REJECTED = 1;

function readScenario(): Scenario {
  return JSON.parse(readFileSync(0, "utf8")) as Scenario;
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function main(): void {
  try {
    const results = runScenario(readScenario());
    process.stdout.write(`${JSON.stringify({ results })}\n`);
  } catch (error) {
    process.stderr.write(`${describe(error)}\n`);
    process.exitCode = EXIT_REJECTED;
  }
}

main();
