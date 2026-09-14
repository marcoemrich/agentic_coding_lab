#!/usr/bin/env tsx
import { readFileSync } from 'node:fs';
import { processScenario, type Scenario } from './office.js';

try {
  const input = JSON.parse(readFileSync(0, 'utf8')) as Scenario;
  process.stdout.write(JSON.stringify(processScenario(input)));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
