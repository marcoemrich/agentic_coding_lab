import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

/** File descriptor 0 is stdin; reading it whole is what makes this a pipe filter. */
const STDIN = 0;

/**
 * The sentence the customer sees on stderr when the MHPCO refuses something.
 *
 * Every rejection is an `Error` thrown by the library, so the `instanceof` arm
 * is the real path and `String(cause)` only covers a non-`Error` throw that no
 * code here produces. It stays because the alternative — asserting the type —
 * would print "undefined" for that case instead of something a reader can act
 * on, and this text is the only diagnostic a piped caller gets.
 */
const rejectionMessage = (cause: unknown): string =>
  cause instanceof Error ? cause.message : String(cause);

// A scenario in, its results out: the CLI's whole job is to move JSON across
// the process boundary, so every decision about what those results ARE lives in
// claim-office.ts and none of it is repeated here.
try {
  const scenario = JSON.parse(readFileSync(STDIN, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify({ results: runScenario(scenario) }));
} catch (error) {
  // The library states a refusal by throwing; turning that into an exit code the
  // caller can branch on is the part only the CLI can do. Malformed JSON lands
  // here too, and is reported the same way — from the caller's side both are
  // "the MHPCO would not process this input".
  process.stderr.write(`${rejectionMessage(error)}\n`);
  process.exit(1);
}
