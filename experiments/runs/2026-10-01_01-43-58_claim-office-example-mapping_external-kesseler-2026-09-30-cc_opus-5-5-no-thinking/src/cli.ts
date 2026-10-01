#!/usr/bin/env tsx
import { runScenario } from './scenario';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk: string) => {
  input += chunk;
});
process.stdin.on('end', () => {
  try {
    process.stdout.write(JSON.stringify(runScenario(JSON.parse(input))) + '\n');
  } catch (error) {
    process.stderr.write(`Error: ${(error as Error).message}\n`);
    process.exitCode = 1;
  }
});
