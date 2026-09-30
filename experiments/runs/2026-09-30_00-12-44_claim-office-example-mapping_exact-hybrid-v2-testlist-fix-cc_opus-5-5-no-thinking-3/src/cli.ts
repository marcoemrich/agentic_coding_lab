#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const readScenarioFromStdin = (): Scenario => JSON.parse(readFileSync(process.stdin.fd, "utf8")) as Scenario;

try {
  process.stdout.write(JSON.stringify(runScenario(readScenarioFromStdin())) + "\n");
} catch (error) {
  process.stderr.write(`Error: ${(error as Error).message}\n`);
  process.exitCode = 1;
}
