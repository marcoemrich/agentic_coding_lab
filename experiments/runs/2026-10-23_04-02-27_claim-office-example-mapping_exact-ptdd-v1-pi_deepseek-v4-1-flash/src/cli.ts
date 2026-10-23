import { readFileSync } from "node:fs";
import type { Scenario } from "./scenario.js";
import { runScenario } from "./scenario.js";

function readStdin(): string {
  return readFileSync(0, "utf8");
}

export function main(): void {
  try {
    const scenario = JSON.parse(readStdin()) as Scenario;
    const results = runScenario(scenario);
    process.stdout.write(`${JSON.stringify({ results })}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

main();
