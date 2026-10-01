#!/usr/bin/env -S npx tsx
import { runScenario, type Scenario } from './claimOffice';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  try {
    const output = runScenario(JSON.parse(input) as Scenario);
    process.stdout.write(JSON.stringify(output) + '\n');
  } catch (error) {
    process.stderr.write(`claim-office: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
});
