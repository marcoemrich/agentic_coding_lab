import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

function readScenarioFromStdin(): Scenario {
  return JSON.parse(readFileSync(0, "utf8")) as Scenario;
}

function main(): void {
  try {
    process.stdout.write(`${JSON.stringify(runScenario(readScenarioFromStdin()))}\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

main();
