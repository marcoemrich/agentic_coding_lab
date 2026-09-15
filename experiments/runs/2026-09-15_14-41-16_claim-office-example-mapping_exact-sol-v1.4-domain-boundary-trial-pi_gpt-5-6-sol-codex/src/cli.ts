import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  console.log(JSON.stringify(runScenario(scenario)));
} catch (error) {
  const description = error instanceof Error ? error.message : String(error);
  console.error(description);
  process.exitCode = 1;
}
