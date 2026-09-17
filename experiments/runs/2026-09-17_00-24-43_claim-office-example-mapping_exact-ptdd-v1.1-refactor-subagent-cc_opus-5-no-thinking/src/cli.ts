/**
 * The `claim-office` command: MHPCO's counter clerk.
 *
 * This module is an adapter and owns no ruling of the office's, not even how a
 * scenario is worked through. It carries a scenario in from stdin, hands it to
 * the office, and carries the answers back out to stdout. A scenario the office
 * refuses ends the same way every refusal does: the clerk writes the reason to
 * stderr and reports failure, leaving stdout empty.
 *
 * Everything this module knows is the shape of the paperwork — the JSON the
 * office is addressed in and answers in, and how a refusal is reported at a
 * command line. The rulings behind the answers are made elsewhere.
 */

import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./scenario.js";

/** The clerk takes the whole of stdin as one scenario document. */
const STDIN = 0;

function main(): void {
  const scenario = JSON.parse(readFileSync(STDIN, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify({ results: runScenario(scenario) }));
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
