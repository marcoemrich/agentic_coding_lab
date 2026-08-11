#!/usr/bin/env node
import { runScenario } from './scenario.js';
import type { Scenario } from './types.js';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  const input = await readStdin();

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch (error) {
    throw new Error(`invalid JSON on stdin: ${(error as Error).message}`);
  }

  if (!scenario?.customer || !Array.isArray(scenario.steps)) {
    throw new Error('scenario must have a customer object and a steps array');
  }

  // Fully settle the scenario before writing, so a rejected step leaves
  // stdout empty rather than half a results array.
  const results = runScenario(scenario);
  process.stdout.write(`${JSON.stringify({ results })}\n`);
}

main().catch((error: Error) => {
  process.stderr.write(`claim-office: ${error.message}\n`);
  process.exitCode = 1;
});
