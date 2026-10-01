import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claimOffice.js";

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify({ results: runScenario(scenario) }) + "\n");
} catch (error) {
  process.stderr.write(`claim-office: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
