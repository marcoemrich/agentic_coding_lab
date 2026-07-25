#!/usr/bin/env -S node --import tsx

import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify(processScenario(scenario)));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
