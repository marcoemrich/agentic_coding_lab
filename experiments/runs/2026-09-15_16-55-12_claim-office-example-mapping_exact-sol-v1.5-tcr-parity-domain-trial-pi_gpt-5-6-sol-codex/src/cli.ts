import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

function main(): void {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
}

try {
  main();
} catch (error) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
}
