#!/usr/bin/env node
import { text } from "node:stream/consumers";
import { runScenario, type Scenario } from "./claim-office.js";

// A rejected scenario earns a description of what the office objected to —
// not a stack trace — and nothing at all on stdout.
try {
  const scenario = JSON.parse(await text(process.stdin)) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exitCode = 1;
}
