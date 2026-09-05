import { readFileSync } from "node:fs";
import { ClaimOfficeError, runScenario } from "./claim-office.js";

const STDIN_FD = 0;

// Reads stdin to EOF, so the scenario may arrive in as many chunks as the pipe
// cares to deliver. A scenario is a single JSON document with no terminator of
// its own, so there is nothing to read up to *but* EOF.
const readStdin = (): string => readFileSync(STDIN_FD, "utf8");

// `JSON.parse` returns `any`, so this is the one point where unvalidated input
// is handed to a typed signature. `runScenario` is the validator: it narrows
// each step itself and rejects what it cannot read.
const scenario = JSON.parse(readStdin());

const REJECTED_EXIT_CODE = 1;

// A rejection is the office declining the scenario: report the reason and set a
// non-zero status, with nothing on stdout. Only ClaimOfficeError is caught —
// any other throw is a defect in this program, and its stack trace is the
// point. That includes a SyntaxError from the parse above, which is why the
// parse sits outside this block: the spec gives the office no answer for a
// malformed document, so there is no rejection to report for one.
try {
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  if (!(error instanceof ClaimOfficeError)) throw error;

  process.stderr.write(`${error.message}\n`);
  process.exit(REJECTED_EXIT_CODE);
}
