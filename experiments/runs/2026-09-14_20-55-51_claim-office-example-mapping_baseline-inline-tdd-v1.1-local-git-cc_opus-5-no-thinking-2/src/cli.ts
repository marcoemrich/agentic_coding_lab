#!/usr/bin/env node
import { runScenario, type Scenario } from './scenario.js';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

function parseScenario(raw: string): Scenario {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('input is not valid JSON');
  }
  const scenario = parsed as Partial<Scenario>;
  if (!scenario || typeof scenario !== 'object' || !scenario.customer || !Array.isArray(scenario.steps)) {
    throw new Error('input must be an object with "customer" and "steps"');
  }
  return scenario as Scenario;
}

async function main(): Promise<void> {
  // Nothing is written to stdout until the whole scenario has succeeded, so a
  // rejected scenario leaves stdout empty.
  const scenario = parseScenario(await readStdin());
  const output = runScenario(scenario);
  process.stdout.write(`${JSON.stringify(output)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`claim-office: ${message}\n`);
  process.exitCode = 1;
});
