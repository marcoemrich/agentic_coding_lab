import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

// Reading a file descriptor rather than a path is how the office takes a
// scenario from a pipe; descriptor 0 is standard input by POSIX convention.
const STDIN_FILE_DESCRIPTOR = 0;

const REJECTED = 1;

// What a caught reason says for itself. An Error explains itself by its
// message; anything else thrown has no message to give, so it is stated as it
// stands rather than asserted to be an Error and silently printed as
// "undefined". The office always has a reason to state.
const reasonGivenBy = (declined: unknown): string =>
  declined instanceof Error ? declined.message : String(declined);

try {
  const scenario = JSON.parse(
    readFileSync(STDIN_FILE_DESCRIPTOR, "utf8"),
  ) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (declined) {
  // The office states its reason and nothing else: a stack trace is our
  // business, not the claimant's.
  process.stderr.write(`${reasonGivenBy(declined)}\n`);
  process.exit(REJECTED);
}
