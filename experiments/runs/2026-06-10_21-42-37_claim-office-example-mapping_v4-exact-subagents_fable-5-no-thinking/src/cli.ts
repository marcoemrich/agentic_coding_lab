// cli.ts
//
// Claim Office CLI entry point: reads a scenario JSON document from stdin,
// writes the results JSON to stdout, or a one-line error to stderr (exit 1).
import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

const STDIN_FD = 0;

try {
  const scenario = JSON.parse(readFileSync(STDIN_FD, "utf8"));
  process.stdout.write(JSON.stringify(processScenario(scenario)));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
}
