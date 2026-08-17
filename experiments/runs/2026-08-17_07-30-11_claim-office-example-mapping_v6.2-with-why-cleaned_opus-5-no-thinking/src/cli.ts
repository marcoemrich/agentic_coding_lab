import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const STDIN = 0;

/**
 * Reading, parsing and running all fail the same way from the outside: the
 * scenario cannot be settled, so the office reports why and nothing is paid.
 * Only the message is printed — a stack trace is a crash report, not a
 * description of what was wrong with the input.
 */
try {
  const scenario = JSON.parse(readFileSync(STDIN, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${description}\n`);
  process.exit(1);
}
