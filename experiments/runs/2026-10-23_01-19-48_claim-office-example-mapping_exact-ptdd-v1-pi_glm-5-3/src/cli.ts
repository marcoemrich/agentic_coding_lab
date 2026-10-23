#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runScenario, ScenarioError, type Scenario } from "./scenario.js";

const scenario: Scenario = JSON.parse(readFileSync(process.stdin.fd, "utf8"));
try {
  const results = runScenario(scenario);
  process.stdout.write(JSON.stringify({ results }));
} catch (error) {
  if (error instanceof ScenarioError) {
    process.stderr.write(String(error.message));
    process.exit(1);
  }
  throw error;
}
