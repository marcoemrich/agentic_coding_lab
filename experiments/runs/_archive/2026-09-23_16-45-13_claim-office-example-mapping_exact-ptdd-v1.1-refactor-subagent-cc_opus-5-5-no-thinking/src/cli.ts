#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claimOffice.js";
import { ScenarioRejection } from "./rejection.js";

const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
try {
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  if (!(error instanceof ScenarioRejection)) throw error;
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
