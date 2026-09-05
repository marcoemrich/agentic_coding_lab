#!/usr/bin/env tsx
import { readFileSync } from 'node:fs';
import { runScenario } from './office.js';

try {
  const scenario = JSON.parse(readFileSync(0, 'utf8'));
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output) + '\n');
} catch (error) {
  process.stderr.write((error instanceof Error ? error.message : String(error)) + '\n');
  process.exitCode = 1;
}
