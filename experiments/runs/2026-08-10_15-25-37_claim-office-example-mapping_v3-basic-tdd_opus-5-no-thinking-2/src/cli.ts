#!/usr/bin/env node
import { runScenario } from './scenario.js';
import { parseScenario } from './parse.js';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  const input = await readStdin();
  const scenario = parseScenario(input);
  const results = runScenario(scenario);
  process.stdout.write(`${JSON.stringify({ results })}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
