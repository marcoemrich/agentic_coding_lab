import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./scenario.js";

const REFUSED = 1;

function scenarioFromStdin(): Scenario {
  return JSON.parse(readFileSync(0, "utf8")) as Scenario;
}

/**
 * How a refusal is described to whoever ran the CLI. The MHPCO states its
 * refusals as messages -- "does not insure items of type ...", "policy does
 * not cover ..." -- so a refusal that carries one is reported by it.
 *
 * A refusal that carries no message is still owed a description: the spec
 * requires one on stderr for every non-zero exit, so there is no case in
 * which the CLI may fall silent. Reading the message off an assumed shape
 * would produce exactly that silence, which is why the description is
 * derived here rather than asserted.
 */
function refusalDescription(refusal: unknown): string {
  return refusal instanceof Error ? refusal.message : String(refusal);
}

/**
 * The claim-office adapter: a scenario is read from stdin and its results
 * written to stdout. A refusal by the MHPCO -- an item it does not insure,
 * a damage the policy does not cover, a malformed damage report -- is not a
 * result, so it is reported on stderr and exits non-zero with no results
 * written to stdout.
 *
 * Every answer the MHPCO could not produce is reported the same way. The
 * spec gives all four of its refusal grounds one outcome and distinguishes
 * no other kind of non-answer, so the adapter makes no distinction either:
 * which grounds exist is knowledge held by the rules that raise them, not
 * here.
 */
function main(): void {
  try {
    process.stdout.write(`${JSON.stringify(runScenario(scenarioFromStdin()))}\n`);
  } catch (refusal) {
    process.stderr.write(`${refusalDescription(refusal)}\n`);
    process.exitCode = REFUSED;
  }
}

main();
