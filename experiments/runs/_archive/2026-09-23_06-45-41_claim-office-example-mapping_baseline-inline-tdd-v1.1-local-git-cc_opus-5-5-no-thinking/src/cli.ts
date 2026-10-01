#!/usr/bin/env -S npx tsx
import { runScenario } from './scenario';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

try {
  const output = runScenario(JSON.parse(await readStdin()));
  process.stdout.write(JSON.stringify(output) + '\n');
} catch (error) {
  process.stderr.write(`claim-office: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
