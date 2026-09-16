import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

try {
  const input = readFileSync(0, "utf8");
  const result = processScenario(JSON.parse(input) as Scenario);
  process.stdout.write(JSON.stringify(result));
} catch (error) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
}
