#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

// The office is driven one whole scenario at a time, so the CLI reads stdin to
// end-of-input as a single JSON document rather than streaming line by line.
const STDIN_FILE_DESCRIPTOR = 0;

// A scenario the office refuses (unreadable JSON, uninsurable item, impossible
// claim) is a rejection, not a crash: stdout stays empty and the reason goes to
// stderr, so a caller can tell "no results" from "results".
const REJECTED_SCENARIO_EXIT_CODE = 1;

const settleScenarioFromStdin = (): string => {
  const scenario = JSON.parse(readFileSync(STDIN_FILE_DESCRIPTOR, "utf8")) as Scenario;
  return JSON.stringify(runScenario(scenario));
};

const rejectionReason = (rejection: unknown): string =>
  rejection instanceof Error ? rejection.message : String(rejection);

try {
  // Results are written only once the whole scenario has settled, so a
  // rejection midway through cannot leave partial output on stdout.
  process.stdout.write(settleScenarioFromStdin());
} catch (rejection) {
  process.stderr.write(`${rejectionReason(rejection)}\n`);
  process.exit(REJECTED_SCENARIO_EXIT_CODE);
}
