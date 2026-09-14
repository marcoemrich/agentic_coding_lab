import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

try {
  // Trust boundary. Stdin is untrusted, and this assertion is unchecked: nothing
  // here verifies the parsed document against the `Scenario` shape. That is
  // deliberate — the spec asks the CLI to reject bad *claims* (unknown item type,
  // item not in policy, more damage entries than insured, negative amount), all of
  // which the domain already detects and throws on, not to validate the document
  // schema. A malformed document reaches `runScenario` and fails there.
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;

  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  // The MHPCO reports a rejection as a description, not a stack trace, and
  // writes no results at all.
  //
  // Narrowed rather than asserted `as Error`: this is the last-resort reporter,
  // so the one failure it must not have is losing its own message. Everything
  // thrown here today is an Error (the domain's own throws, and `SyntaxError`
  // from `JSON.parse` on a malformed document), but an asserted non-Error would
  // print the literal text "undefined" — a non-zero exit with no description,
  // which is the exact outcome writing to stderr exists to avoid.
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
}
