/*
 * The command-line face of the claim office: one scenario in as JSON on
 * stdin, one outcome out as JSON on stdout.
 */

import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

/**
 * File descriptor 0. Reading a file descriptor synchronously is how a script
 * drains stdin to the end in one go — `readFileSync(STDIN)` says that, where
 * the bare `0` would leave the reader to recall the convention.
 */
const STDIN = 0;

/**
 * A rejected scenario is reported, not crashed on.
 *
 * The scenario rejections in the specification — an unknown item type, a damage
 * entry naming an item the policy does not cover, an item damaged more often
 * than it is insured, and a negative damage amount — all reach here as a throw
 * from the domain. Each must leave a description on stderr, a non-zero status,
 * and stdout empty.
 *
 * Without this block that outcome still held, but only as a side effect of
 * Node's uncaught-exception handler: the message arrived wrapped in a stack
 * trace, and nothing in this file said the contract was intended rather than
 * incidental. Catching states it. `process.exitCode` rather than
 * `process.exit()` so the stderr write is allowed to drain.
 *
 * Only the message is printed. A stack trace describes where MHPCO's code is,
 * not what the claimant got wrong, and the caller of a CLI is owed the latter.
 */
try {
  const scenario = JSON.parse(readFileSync(STDIN, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
}
