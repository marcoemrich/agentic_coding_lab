#!/usr/bin/env -S node --import tsx
import { readFileSync } from 'node:fs';
import { processScenario, type Scenario } from './claim-office.js';

try {
  const input = JSON.parse(readFileSync(0, 'utf8')) as Scenario;
  const output = processScenario(input);
  process.stdout.write(JSON.stringify(output));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`claim-office: ${message}\n`);
  process.exitCode = 1;
}
