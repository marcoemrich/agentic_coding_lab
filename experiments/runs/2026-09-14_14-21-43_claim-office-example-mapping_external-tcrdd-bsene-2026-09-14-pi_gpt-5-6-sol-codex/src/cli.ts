#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { processScenario, type Scenario } from './claim-office';

try {
  const scenario = JSON.parse(readFileSync(0, 'utf8')) as Scenario;
  process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`claim-office: ${message}\n`);
  process.exitCode = 1;
}
