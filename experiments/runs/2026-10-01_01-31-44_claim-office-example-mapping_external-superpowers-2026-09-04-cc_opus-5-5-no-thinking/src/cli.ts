#!/usr/bin/env -S npx tsx
import { readFileSync } from 'node:fs';
import { runScenario } from './claimOffice';

try {
  const scenario = JSON.parse(readFileSync(0, 'utf8'));
  process.stdout.write(JSON.stringify(runScenario(scenario)) + '\n');
} catch (error) {
  process.stderr.write(`claim-office: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
