import { readFileSync } from "node:fs";
import { type Scenario, runScenario } from "./scenario.js";

const REJECTED_EXIT_CODE = 1;

// The trust boundary. The scenario schema in the specification is normative, so
// a document that reaches us is taken at its word and asserted to be a
// `Scenario` rather than validated field by field: nothing in the office's rules
// decides what a well-formed document is, and no example asks this adapter to
// answer a malformed one. A document that breaks the schema therefore fails as a
// parse error or as a shape mismatch inside the rules, and is reported by the
// same refusal path as a domain rejection below -- deliberately, not by
// oversight. Validating here would invent a contract the specification does not
// state and would move the decision out of the office and into the transport.
function readScenarioFromStdin(): Scenario {
  return JSON.parse(readFileSync(0, "utf8")) as Scenario;
}

// The office either answers every step or refuses the whole document: a refusal
// writes its description to stderr and leaves stdout empty. A refusal always
// arrives as a thrown `Error` carrying a description and nothing else, which is
// the only outbound contract the rules offer, so translating it needs no domain
// knowledge -- just its message, an empty stdout, and a non-zero exit.
function main(): void {
  try {
    const results = runScenario(readScenarioFromStdin());
    process.stdout.write(`${JSON.stringify({ results })}\n`);
  } catch (rejection) {
    process.stderr.write(`${(rejection as Error).message}\n`);
    process.exitCode = REJECTED_EXIT_CODE;
  }
}

// A CLI entry point is the program, not a library: the module's only purpose is
// to run once when `tsx src/cli.ts` is invoked, so the call belongs at top level.
// Nothing imports this module -- the rules are imported from `scenario.js`
// instead -- so there is no caller for whom this side effect could be a surprise.
main();
