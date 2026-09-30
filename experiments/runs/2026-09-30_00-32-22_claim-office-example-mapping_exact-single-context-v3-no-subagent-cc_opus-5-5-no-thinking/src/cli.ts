import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const STDIN = 0;

try {
  const scenario: Scenario = JSON.parse(readFileSync(STDIN, "utf8"));
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output));
} catch (error) {
  process.stderr.write(`claim-office: ${(error as Error).message}\n`);
  process.exitCode = 1;
}
