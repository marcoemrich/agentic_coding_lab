import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

/**
 * File descriptor 0 is stdin. Reading it synchronously rather than streaming is
 * deliberate: a scenario is a single JSON document that must be complete before
 * it can be parsed at all, so there is nothing to do with a partial read.
 */
const STDIN_FD = 0;

/**
 * The cast is unchecked — `JSON.parse` returns `any`, and nothing here verifies
 * the document is a well-formed Scenario. That is not an oversight: the engine
 * already rejects the malformed cases the spec names (unknown item types,
 * uninsured damages, negative amounts) with domain-specific messages, and the
 * upcoming CLI error test drives turning those throws into a non-zero exit.
 * A schema check here would duplicate those rules in a second, weaker form.
 */
const readScenarioFromStdin = (): Scenario =>
  JSON.parse(readFileSync(STDIN_FD, "utf8")) as Scenario;

/**
 * Reads a scenario from stdin, runs it, and writes the results to stdout.
 *
 * A rejected scenario is a report about the input, not a program failure, so
 * the operator gets the description alone — a stack trace would bury it. The
 * result is written only after the run succeeds, so a rejected scenario leaves
 * stdout empty rather than emitting partial results.
 */
const runCli = (): void => {
  try {
    const results = runScenario(readScenarioFromStdin());
    process.stdout.write(JSON.stringify(results));
  } catch (rejection) {
    process.stderr.write(`${(rejection as Error).message}\n`);
    process.exit(1);
  }
};

runCli();
