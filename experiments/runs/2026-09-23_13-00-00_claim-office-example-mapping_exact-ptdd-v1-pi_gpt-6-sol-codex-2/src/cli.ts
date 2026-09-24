#!/usr/bin/env -S node --import tsx
import { runScenario, type Scenario } from "./office.js";

try {
  let input = "";
  for await (const chunk of process.stdin) input += String(chunk);
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)) + "\n");
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
