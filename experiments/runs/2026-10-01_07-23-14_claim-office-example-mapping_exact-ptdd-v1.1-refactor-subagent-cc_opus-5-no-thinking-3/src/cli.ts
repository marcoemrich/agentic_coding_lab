import { readFileSync } from "node:fs";
import { resultsFor, type Scenario } from "./scenario.js";

// The CLI adapter: it only translates between the office and the outside
// world -- scenario JSON in on stdin, result JSON out on stdout, and any
// refusal the office raises reported on stderr with a non-zero exit status.

function main(): void {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify({ results: resultsFor(scenario) }));
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
