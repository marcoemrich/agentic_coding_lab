#!/usr/bin/env -S npx tsx

import { readFileSync } from "node:fs";

import { runScenario, type Scenario } from "./claim-office.js";

const STDIN_FD = 0;
const REJECTED_EXIT_CODE = 1;

function readScenario(): Scenario {
  return JSON.parse(readFileSync(STDIN_FD, "utf8")) as Scenario;
}

/** A scenario the MHPCO rejects is reported on stderr, leaving stdout empty. */
function reportRejection(error: unknown): never {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${description}\n`);
  process.exit(REJECTED_EXIT_CODE);
}

try {
  const results = runScenario(readScenario());
  process.stdout.write(JSON.stringify({ results }));
} catch (error) {
  reportRejection(error);
}
