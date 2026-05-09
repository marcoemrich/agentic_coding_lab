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

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

async function main(): Promise<void> {
  try {
    const raw = await readStdin();
    const scenario = JSON.parse(raw) as Scenario;
    const output = runScenario(scenario);
    process.stdout.write(JSON.stringify(output) + '\n');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    process.stderr.write(`Error: ${msg}\n`);
    process.exit(1);
  }
}

main();
