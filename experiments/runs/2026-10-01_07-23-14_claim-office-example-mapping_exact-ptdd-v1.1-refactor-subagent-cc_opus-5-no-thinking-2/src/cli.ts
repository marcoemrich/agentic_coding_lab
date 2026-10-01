import { readFileSync } from "node:fs";

import { runScenario, type Scenario } from "./claim-office.js";

// The scenario arrives on standard input, which the operating system hands this process as
// file descriptor 0 -- read whole, because a scenario is one document and the office reads
// it in full before working any of its steps.
const STDIN_FD = 0;

// The claim-office CLI is only an adapter: it translates a JSON scenario on stdin into the
// MHPCO's operations and their results back out, and reports a refusal on stderr.
function main(): void {
  const scenario = JSON.parse(readFileSync(STDIN_FD, "utf8")) as Scenario;
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
}

main();
