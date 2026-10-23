#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claimOffice.js";

const input = readFileSync(0, "utf-8");
try {
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
