#!/usr/bin/env node
import { runScenario, type Scenario } from './scenario';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  const input = await readStdin();

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch (error) {
    throw new Error(`invalid JSON input: ${(error as Error).message}`);
  }

  // Nothing is written to stdout unless the whole scenario processes cleanly.
  const output = runScenario(scenario);
  process.stdout.write(`${JSON.stringify(output)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
