import { readFileSync } from "node:fs";
import { runScenario } from "./scenario.js";

const STDIN = 0;

function errorDescription(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

try {
  const scenario = JSON.parse(readFileSync(STDIN, "utf8"));
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
} catch (error) {
  process.stderr.write(`${errorDescription(error)}\n`);
  process.exitCode = 1;
}
