#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { processScenario } from './claim-office.js';

// Read JSON from stdin
process.stdin.setEncoding('utf8');
let input = '';

process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    const scenario = JSON.parse(input);
    const result = processScenario(scenario);
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  } catch (error) {
    process.stderr.write(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
});
