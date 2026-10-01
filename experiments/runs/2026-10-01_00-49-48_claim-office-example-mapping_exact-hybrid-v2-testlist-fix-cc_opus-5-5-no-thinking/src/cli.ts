import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

try {
  const scenario: Scenario = JSON.parse(readFileSync(0, "utf8"));
  process.stdout.write(JSON.stringify(runScenario(scenario)) + "\n");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
}
