#!/usr/bin/env -S node --import tsx
import { processScenario, type Scenario } from './claim-office';

async function main(): Promise<void> {
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
    const scenario = JSON.parse(Buffer.concat(chunks).toString('utf8')) as Scenario;
    process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exitCode = 1;
  }
}

void main();
