#!/usr/bin/env node
import { runScenario, type Scenario } from './scenario';

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
    const results = runScenario(scenario);
    process.stdout.write(`${JSON.stringify({ results })}\n`);
  } catch (error) {
    process.stderr.write(`error: ${(error as Error).message}\n`);
    process.exitCode = 1;
  }
}

void main();
