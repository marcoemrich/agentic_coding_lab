#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { run, type Scenario } from './office.js';
try {
  const scenario = JSON.parse(readFileSync(0, 'utf8')) as Scenario;
  process.stdout.write(JSON.stringify(run(scenario)) + '\n');
} catch (error) {
  process.stderr.write((error instanceof Error ? error.message : String(error)) + '\n');
  process.exitCode = 1;
}
