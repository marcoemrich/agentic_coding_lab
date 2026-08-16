#!/usr/bin/env -S npx tsx
import { readFileSync } from 'node:fs';
import { processScenario } from './claim-office.js';

try {
  const input: unknown = JSON.parse(readFileSync(0, 'utf8'));
  process.stdout.write(JSON.stringify(processScenario(input)));
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
}
