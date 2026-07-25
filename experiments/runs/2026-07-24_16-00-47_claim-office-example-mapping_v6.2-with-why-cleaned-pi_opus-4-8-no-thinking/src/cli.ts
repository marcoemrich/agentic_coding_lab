#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runScenario, Scenario } from "./claim-office.js";

const main = (): void => {
  const raw = readFileSync(0, "utf8");
  const scenario = JSON.parse(raw) as Scenario;
  const results = runScenario(scenario);
  process.stdout.write(JSON.stringify({ results }) + "\n");
};

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
}
