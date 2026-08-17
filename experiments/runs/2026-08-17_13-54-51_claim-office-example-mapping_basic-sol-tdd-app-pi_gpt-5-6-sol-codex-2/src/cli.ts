import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

function errorDescription(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify(processScenario(scenario)));
} catch (error: unknown) {
  process.stderr.write(`${errorDescription(error)}\n`);
  process.exitCode = 1;
}
