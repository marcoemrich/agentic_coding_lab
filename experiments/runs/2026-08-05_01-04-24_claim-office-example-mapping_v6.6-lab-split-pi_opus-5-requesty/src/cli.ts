#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const STDIN_FILE_DESCRIPTOR = 0;
const EXIT_FAILURE = 1;

try {
  const scenario = JSON.parse(
    readFileSync(STDIN_FILE_DESCRIPTOR, "utf8"),
  ) as Scenario;
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(EXIT_FAILURE);
}
