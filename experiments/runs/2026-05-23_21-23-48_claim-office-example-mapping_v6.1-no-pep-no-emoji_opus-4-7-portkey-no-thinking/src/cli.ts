import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

try {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input) as Scenario;
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
} catch (err) {
  process.stderr.write(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
