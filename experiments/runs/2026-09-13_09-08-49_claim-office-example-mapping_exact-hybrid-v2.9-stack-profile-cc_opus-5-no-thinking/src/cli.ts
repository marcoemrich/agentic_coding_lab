import { readFileSync } from "node:fs";

import { runScenario, type Scenario } from "./claim-office.js";

// Named because a bare 0 in readFileSync(0, ...) reads as a byte offset or a
// length far more readily than as a file descriptor.
const STDIN_FD = 0;

try {
  // Reads the whole scenario from stdin in one go, so a document split across
  // chunks is parsed only once complete.
  const scenario = JSON.parse(readFileSync(STDIN_FD, "utf8")) as Scenario;

  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
} catch (error) {
  // Only the message: a stack trace is a crash report, not the error
  // description the spec asks for. The stdout write sits inside the try, so a
  // rejected scenario leaves stdout untouched.
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );

  // exitCode rather than exit(1), so buffered stdio flushes before exiting.
  process.exitCode = 1;
}
