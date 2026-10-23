import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./scenario.js";

function main(): void {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input) as Scenario;
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output) + "\n");
}

try {
  main();
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exitCode = 1;
}
