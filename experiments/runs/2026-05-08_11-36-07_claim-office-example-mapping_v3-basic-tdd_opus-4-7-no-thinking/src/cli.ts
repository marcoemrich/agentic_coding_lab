#!/usr/bin/env node
import { runScenario } from './scenario.js';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  let input: string;
  try {
    input = await readStdin();
  } catch (err) {
    process.stderr.write(`Failed to read stdin: ${(err as Error).message}\n`);
    process.exit(1);
    return;
  }

  let scenario: unknown;
  try {
    scenario = JSON.parse(input);
  } catch (err) {
    process.stderr.write(`Invalid JSON on stdin: ${(err as Error).message}\n`);
    process.exit(1);
    return;
  }

  let result;
  try {
    result = runScenario(scenario as any);
  } catch (err) {
    process.stderr.write(`${(err as Error).message}\n`);
    process.exit(1);
    return;
  }

  process.stdout.write(JSON.stringify(result) + '\n');
}

main().catch((err) => {
  process.stderr.write(`${(err as Error).message}\n`);
  process.exit(1);
});
