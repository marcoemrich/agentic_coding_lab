#!/usr/bin/env -S node --import tsx
import { processScenario, type Scenario } from './claim-office.js';

async function main(): Promise<void> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  const scenario = JSON.parse(Buffer.concat(chunks).toString('utf8')) as Scenario;
  const output = processScenario(scenario);
  process.stdout.write(`${JSON.stringify(output)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`claim-office: ${message}\n`);
  process.exitCode = 1;
});
