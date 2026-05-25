#!/usr/bin/env node
import { processScenario, Scenario } from './claimOffice.js';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function main() {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input) as Scenario;
    const output = processScenario(scenario);
    process.stdout.write(JSON.stringify(output));
    process.stdout.write('\n');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: ${msg}\n`);
    process.exit(1);
  }
}

main();
