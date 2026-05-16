#!/usr/bin/env node
import { runScenario } from './scenario.js';
import type { Scenario } from './types.js';

async function readAll(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : (chunk as Buffer));
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  const raw = await readAll(process.stdin);
  let scenario: Scenario;
  try {
    scenario = JSON.parse(raw) as Scenario;
  } catch (e) {
    process.stderr.write(`Failed to parse JSON input: ${(e as Error).message}\n`);
    process.exit(1);
  }
  try {
    const results = runScenario(scenario);
    process.stdout.write(JSON.stringify(results) + '\n');
  } catch (e) {
    process.stderr.write(`${(e as Error).message}\n`);
    process.exit(1);
  }
}

main().catch((e) => {
  process.stderr.write(`${(e as Error).message}\n`);
  process.exit(1);
});
