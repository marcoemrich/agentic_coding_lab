#!/usr/bin/env node
import { runScenario, type Scenario } from './scenario.js';

async function readStdin(): Promise<string> {
  let data = '';
  for await (const chunk of process.stdin) {
    data += chunk;
  }
  return data;
}

async function main(): Promise<void> {
  try {
    const raw = await readStdin();
    const scenario = JSON.parse(raw) as Scenario;
    const output = runScenario(scenario);
    process.stdout.write(JSON.stringify(output) + '\n');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(message + '\n');
    process.exit(1);
  }
}

void main();
