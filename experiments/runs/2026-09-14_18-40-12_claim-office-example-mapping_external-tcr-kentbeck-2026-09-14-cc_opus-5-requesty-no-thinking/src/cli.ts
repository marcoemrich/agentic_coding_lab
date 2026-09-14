#!/usr/bin/env node
import { pathToFileURL } from 'node:url';
import { Scenario, StepResult, runScenario } from './scenario';

export function processScenario(input: string): string {
  const scenario = JSON.parse(input) as Scenario;
  if (scenario === null || typeof scenario !== 'object') {
    throw new Error('scenario must be a JSON object');
  }
  if (scenario.customer === undefined || typeof scenario.customer.yearsWithMHPCO !== 'number') {
    throw new Error('scenario.customer.yearsWithMHPCO is required');
  }
  if (!Array.isArray(scenario.steps)) {
    throw new Error('scenario.steps must be an array');
  }
  const results: StepResult[] = runScenario(scenario);
  return JSON.stringify({ results });
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  try {
    const output = processScenario(await readStdin());
    process.stdout.write(`${output}\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

const isEntryPoint =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntryPoint) void main();
