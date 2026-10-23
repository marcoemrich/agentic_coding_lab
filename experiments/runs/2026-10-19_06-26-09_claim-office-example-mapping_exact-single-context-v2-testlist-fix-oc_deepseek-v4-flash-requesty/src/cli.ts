import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

try {
  const input = readFileSync(0, "utf8");
  const scenario: Scenario = JSON.parse(input);
  const { results } = runScenario(scenario);
  process.stdout.write(JSON.stringify({ results }));
} catch (error) {
  process.stderr.write(error instanceof Error ? error.message : String(error));
  process.exit(1);
}