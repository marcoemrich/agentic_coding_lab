#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claimOffice.js";

const reportRejection = (error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
};

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  reportRejection(error);
}
