import { readFileSync } from "node:fs";

import { runScenario, type Scenario, type ScenarioResults } from "./claim-office.js";

/**
 * The CLI is the MHPCO's counter clerk, not one of its clause readers: it takes
 * the scenario document a caller hands in, carries it to the claim office
 * unread, and carries the office's answer back out. Every decision about items,
 * premiums, payouts and refusals belongs to `claim-office`; this file only
 * decides how a document and a refusal cross the process boundary.
 */

/**
 * The scenario document arrives as JSON, which the specification's schema fixes
 * as binding. Nothing checks the parsed document against that schema: no
 * example and no test fixes what the office does with a malformed one, so the
 * cast states what the caller is required to hand in rather than a validation
 * the MHPCO performs. Settle malformed input with a test before relying on it.
 */
function decodeScenario(document: string): Scenario {
  return JSON.parse(document) as Scenario;
}

function encodeResults(results: ScenarioResults): string {
  return `${JSON.stringify(results)}\n`;
}

try {
  process.stdout.write(encodeResults(runScenario(decodeScenario(readFileSync(0, "utf8")))));
} catch (refusal) {
  /**
   * A refusal by the claim office is reported in the caller's own terms rather
   * than the office's: the description goes to stderr and the process exits
   * non-zero, leaving stdout empty of results. This translation changes with
   * the conventions of whoever runs the command, not with any MHPCO clause.
   */
  process.stderr.write(`${refusal instanceof Error ? refusal.message : String(refusal)}\n`);
  process.exit(1);
}
