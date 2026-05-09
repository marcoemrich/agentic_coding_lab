#!/usr/bin/env node
import { runScenario, Scenario } from './scenario.js';

declare const process: {
  stdin: {
    setEncoding: (enc: string) => void;
    on: (event: string, cb: (arg?: unknown) => void) => void;
  };
  stdout: { write: (s: string) => void };
  stderr: { write: (s: string) => void };
  exit: (code: number) => void;
};

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => { data += chunk as string; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', (e) => reject(e));
  });
}

async function main(): Promise<void> {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input) as Scenario;
    const output = runScenario(scenario);
    process.stdout.write(JSON.stringify(output) + '\n');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: ${message}\n`);
    process.exit(1);
  }
}

main();
