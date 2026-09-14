import { text } from "node:stream/consumers";
import { runScenario, type Scenario } from "./claim-office.js";

// The CLI is a thin transport around runScenario: JSON in on stdin, JSON out
// on stdout. All domain rules — and every rejection — live in claim-office.ts.
//
// A rejected scenario is a normal outcome for this tool, not a crash: the
// operator gets the reason on stderr and a non-zero status, with stdout left
// empty so it is never mistaken for a result. Reporting it here rather than
// letting the error escape keeps a Node stack trace out of the operator's way.
try {
  const scenario = JSON.parse(await text(process.stdin)) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
  // Set rather than process.exit, which would truncate pending stdout writes.
  process.exitCode = 1;
}
