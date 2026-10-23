import { readFileSync } from "node:fs";
import { runScenario, type Result, type Scenario } from "./scenario.js";

function readScenario(): Scenario {
  return JSON.parse(readFileSync(0, "utf8")) as Scenario;
}

function writeResults(results: Result[]): void {
  process.stdout.write(JSON.stringify({ results }));
}

try {
  writeResults(runScenario(readScenario()));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
