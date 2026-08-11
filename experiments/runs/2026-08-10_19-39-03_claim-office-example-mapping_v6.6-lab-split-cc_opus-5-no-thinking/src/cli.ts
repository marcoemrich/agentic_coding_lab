// The `claim-office` executable. Reads a JSON scenario from stdin, writes the
// JSON results to stdout. Everything it knows about the MHPCO's rules it asks
// claim-office.ts; its own job is the process boundary.

import { text } from "node:stream/consumers";

import { runScenario, type Scenario } from "./claim-office.js";

// `text` drains stdin to EOF and decodes it as UTF-8, which is the whole of
// what the hand-rolled chunk loop it replaced was doing.
//
// Named for what this value actually is: the scenario as the CALLER claims it,
// not a scenario the process has checked. The `as` is an assertion, so the type
// is a promise TypeScript makes on the caller's behalf and cannot keep — a
// malformed payload reaches runScenario looking well-typed. Calling the binding
// `scenario` would let that assertion read as a validation at every later
// glance. It stays flagged until an example forces a real parse.
const claimedScenario = JSON.parse(await text(process.stdin)) as Scenario;

const REFUSED = 1;

// A refused scenario is described, not crashed on: the customer gets the
// MHPCO's reason on stderr and nothing at all on stdout.
//
// The binding is named for what it verifiably is — something thrown — and not
// `refusal`, because nothing here has established that it IS one. A refusal
// from rejection.ts and a TypeError from a bug in this codebase both land in
// this catch and are both reported as the MHPCO's reason. No example forces
// the distinction yet; the name is what keeps the gap visible until one does.
try {
  process.stdout.write(JSON.stringify(runScenario(claimedScenario)));
} catch (thrown) {
  process.stderr.write(`${(thrown as Error).message}\n`);
  process.exit(REFUSED);
}
