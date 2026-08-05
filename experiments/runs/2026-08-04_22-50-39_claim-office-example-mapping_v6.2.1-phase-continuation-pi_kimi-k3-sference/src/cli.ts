import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

try {
  const input = readFileSync(0, "utf-8");
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
