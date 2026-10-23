import { readFileSync } from "node:fs";
import { RejectionError, runScenario, type Scenario } from "./office.js";

/** Exit status for a rejected scenario: the whole claim or quote is refused. */
const EXIT_REJECTED = 1;

function main(): void {
  let scenario: Scenario;
  try {
    scenario = JSON.parse(readFileSync(process.stdin.fd, "utf8")) as Scenario;
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exit(EXIT_REJECTED);
  }
  try {
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result));
  } catch (error) {
    if (!(error instanceof RejectionError)) {
      throw error;
    }
    process.stderr.write(`${error.message}\n`);
    process.exit(EXIT_REJECTED);
  }
}

main();
