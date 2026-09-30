import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const STDIN_FD = 0;
const EXIT_FAILURE = 1;

try {
  const input = readFileSync(STDIN_FD, "utf8");
  const scenario: Scenario = JSON.parse(input);
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`claim-office: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = EXIT_FAILURE;
}
