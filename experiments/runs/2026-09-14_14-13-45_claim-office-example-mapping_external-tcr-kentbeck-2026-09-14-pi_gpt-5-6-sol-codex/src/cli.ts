#!/usr/bin/env -S tsx
import process from 'node:process';
import { runScenario } from './claim-office';

async function main(): Promise<void> {
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
    const input = JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
    process.stdout.write(`${JSON.stringify(runScenario(input))}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exitCode = 1;
  }
}

await main();
