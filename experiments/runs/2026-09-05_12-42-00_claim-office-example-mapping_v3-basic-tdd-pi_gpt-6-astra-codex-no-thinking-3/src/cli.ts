#!/usr/bin/env -S npx --no-install tsx
import { readFileSync } from 'node:fs';
import { runScenario } from './office';

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const output = runScenario(input);
  process.stdout.write(JSON.stringify(output) + '\n');
} catch (error) {
  process.stderr.write(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
