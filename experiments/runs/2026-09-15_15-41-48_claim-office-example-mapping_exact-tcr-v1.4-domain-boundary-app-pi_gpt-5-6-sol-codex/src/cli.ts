import { readFileSync } from "node:fs";
import { executeScenario, type Scenario } from "./office.js";

try {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(JSON.stringify(executeScenario(scenario)));
} catch (error) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
}
