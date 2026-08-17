import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const FAILURE_EXIT_CODE = 1;

function main(): void {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(JSON.stringify({ results: runScenario(scenario) }));
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(FAILURE_EXIT_CODE);
}
