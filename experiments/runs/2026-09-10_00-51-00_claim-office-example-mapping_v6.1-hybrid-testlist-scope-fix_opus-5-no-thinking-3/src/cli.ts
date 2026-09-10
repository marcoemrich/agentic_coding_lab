import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  // The whole scenario is computed before anything is written, so a rejected
  // step leaves stdout empty rather than half a results array.
  const output = JSON.stringify(runScenario(scenario));
  process.stdout.write(output);
} catch (error) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`error: ${description}\n`);
  process.exit(1);
}
