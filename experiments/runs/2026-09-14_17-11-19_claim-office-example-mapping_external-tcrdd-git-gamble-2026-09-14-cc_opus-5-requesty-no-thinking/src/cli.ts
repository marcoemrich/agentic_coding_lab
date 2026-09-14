#!/usr/bin/env -S npx tsx
import { runScenario } from './scenario.js';
import type { Scenario } from './scenario.js';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  const input = await readStdin();
  try {
    const scenario = JSON.parse(input) as Scenario;
    process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exitCode = 1;
  }
}

void main();
