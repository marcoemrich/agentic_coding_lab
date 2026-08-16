import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

try {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${description}\n`);
  process.exitCode = 1;
}
