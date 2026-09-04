import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

// The scenario arrives on stdin as a single JSON document, read to EOF by file
// descriptor rather than streamed — there is nothing to do until all of it has
// arrived.
const STDIN_FILE_DESCRIPTOR = 0;

// A rejected scenario yields an explanation on stderr and no results at all:
// the office does not report a partial settlement. Since the whole scenario is
// run before anything is written, a rejection anywhere leaves stdout untouched.
try {
  const scenario = JSON.parse(
    readFileSync(STDIN_FILE_DESCRIPTOR, "utf8"),
  ) as Scenario;

  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(1);
}
