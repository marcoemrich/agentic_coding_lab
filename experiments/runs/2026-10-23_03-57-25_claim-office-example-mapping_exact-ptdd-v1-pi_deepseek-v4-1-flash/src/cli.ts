import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./scenario.js";

function main(): void {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input) as Scenario;
  const results = runScenario(scenario);
  process.stdout.write(`${JSON.stringify({ results })}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
