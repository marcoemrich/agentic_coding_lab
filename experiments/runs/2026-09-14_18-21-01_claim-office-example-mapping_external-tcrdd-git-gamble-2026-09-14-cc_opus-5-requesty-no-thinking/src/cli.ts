#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { runScenario, type Scenario } from './scenario.js';

function main(): void {
  const input = readFileSync(0, 'utf8');
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(1);
}
