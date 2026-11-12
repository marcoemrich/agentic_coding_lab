import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

const STDIN = 0;

try {
  const scenario = JSON.parse(readFileSync(STDIN, "utf8")) as Scenario;
  process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
} catch (error) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`claim-office: ${description}\n`);
  process.exitCode = 1;
}
