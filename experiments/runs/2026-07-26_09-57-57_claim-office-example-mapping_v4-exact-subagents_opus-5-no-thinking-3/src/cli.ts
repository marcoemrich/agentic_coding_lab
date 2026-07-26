import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";
import type { Scenario, ScenarioResult } from "./claim-office.js";

const STDIN_FILE_DESCRIPTOR = 0;
const FAILURE_EXIT_CODE = 1;

const readScenarioFromStdin = (): Scenario =>
  JSON.parse(readFileSync(STDIN_FILE_DESCRIPTOR, "utf-8"));

const reportResult = (result: ScenarioResult): void => {
  process.stdout.write(JSON.stringify(result));
};

const reportFailure = (error: unknown): void => {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exitCode = FAILURE_EXIT_CODE;
};

const main = (): void => {
  try {
    reportResult(runScenario(readScenarioFromStdin()));
  } catch (error) {
    reportFailure(error);
  }
};

main();
