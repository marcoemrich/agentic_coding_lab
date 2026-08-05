import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

// A scenario is fed to the office on stdin, one JSON document per run.
const STDIN_FILE_DESCRIPTOR = 0;
const REJECTED_SCENARIO_EXIT_CODE = 1;

const readScenarioFromStdin = (): Scenario =>
  JSON.parse(readFileSync(STDIN_FILE_DESCRIPTOR, "utf8")) as Scenario;

// A rejected scenario is answered with the plain reason it was rejected,
// never with a stack trace.
const describeRejection = (rejection: unknown): string =>
  rejection instanceof Error ? rejection.message : String(rejection);

// The office either files a full set of results, or files none at all and
// says why: results and rejections never share the same run.
try {
  process.stdout.write(JSON.stringify(runScenario(readScenarioFromStdin())));
} catch (rejection) {
  process.stderr.write(`${describeRejection(rejection)}\n`);
  process.exit(REJECTED_SCENARIO_EXIT_CODE);
}
