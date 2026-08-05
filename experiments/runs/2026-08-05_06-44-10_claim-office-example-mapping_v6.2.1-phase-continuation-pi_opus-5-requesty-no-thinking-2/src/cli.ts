import { text } from "node:stream/consumers";
import { runScenario, type Scenario } from "./claim-office.js";

const FAILURE_EXIT_CODE = 1;

const describeRejection = (reason: unknown): string =>
  reason instanceof Error ? reason.message : String(reason);

// A scenario the office refuses produces no results at all: the reason goes to
// stderr and the process reports failure, leaving stdout empty.
const reportRejection = (reason: unknown): void => {
  process.stderr.write(`${describeRejection(reason)}\n`);
  process.exitCode = FAILURE_EXIT_CODE;
};

// The scenario is fed in as JSON on stdin, the results go out as JSON on stdout.
const runScenarioFromStdin = async (): Promise<void> => {
  const scenario = JSON.parse(await text(process.stdin)) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

runScenarioFromStdin().catch(reportRejection);
