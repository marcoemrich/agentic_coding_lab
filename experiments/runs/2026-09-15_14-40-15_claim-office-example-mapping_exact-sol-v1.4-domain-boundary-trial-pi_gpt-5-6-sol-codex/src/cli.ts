import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

function errorDescription(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

try {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${errorDescription(error)}\n`);
  process.exitCode = 1;
}
