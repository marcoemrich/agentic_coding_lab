#!/usr/bin/env tsx
import { runScenario, Scenario } from './scenario';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export function handleScenario(input: string): string {
  const scenario = JSON.parse(input) as Scenario;
  const output = runScenario(scenario);
  return JSON.stringify(output);
}

async function main(): Promise<void> {
  try {
    const input = await readStdin();
    process.stdout.write(handleScenario(input));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office error: ${message}\n`);
    process.exit(1);
  }
}

// Only drive stdin/stdout when run as the executable, not when imported by tests.
const invokedDirectly = process.argv[1] !== undefined && import.meta.url === `file://${process.argv[1]}`;
if (invokedDirectly) {
  void main();
}
