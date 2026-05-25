#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { processScenario, type Scenario } from './engine.js';

function main(): void {
  try {
    const raw = readFileSync(0, 'utf8');
    const scenario = JSON.parse(raw) as Scenario;
    const out = processScenario(scenario);
    process.stdout.write(JSON.stringify(out));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(msg + '\n');
    process.exit(1);
  }
}

main();
