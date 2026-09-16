import { readFileSync } from "node:fs";

import { runScenario, type Scenario } from "./claim-office.js";

function main(): void {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify({ results: runScenario(scenario) }));
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
