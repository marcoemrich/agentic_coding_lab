#!/usr/bin/env -S node --import tsx
import { runScenario, type Scenario } from './office.js';

try {
  let input = '';
  for await (const chunk of process.stdin) input += chunk.toString();
  const scenario = JSON.parse(input) as Scenario;
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output) + '\n');
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
