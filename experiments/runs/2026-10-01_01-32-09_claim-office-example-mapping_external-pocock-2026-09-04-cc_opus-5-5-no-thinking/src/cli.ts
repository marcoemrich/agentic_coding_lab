#!/usr/bin/env -S node --import tsx
import { runScenario, type Scenario } from './claimOffice';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

const scenario = JSON.parse(await readStdin()) as Scenario;
process.stdout.write(JSON.stringify(runScenario(scenario)) + '\n');
