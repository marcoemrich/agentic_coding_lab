import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  const output = processScenario(scenario);
  process.stdout.write(`${JSON.stringify(output)}\n`);
} catch (error) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
}
