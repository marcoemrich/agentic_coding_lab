import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./scenario.js";

function main(): void {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  const results = runScenario(scenario);
  process.stdout.write(JSON.stringify({ results }));
}

try {
  main();
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(1);
}
