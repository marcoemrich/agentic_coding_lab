#!/usr/bin/env -S node --import tsx
import { processScenario } from './claim-office.js';

async function main(): Promise<void> {
  try {
    let input = '';
    for await (const chunk of process.stdin) input += String(chunk);
    const scenario: unknown = JSON.parse(input);
    const output = processScenario(scenario);
    process.stdout.write(JSON.stringify(output));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exitCode = 1;
  }
}

void main();
