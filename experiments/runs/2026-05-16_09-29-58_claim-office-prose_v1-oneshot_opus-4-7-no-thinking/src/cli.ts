#!/usr/bin/env node
import { runScenario } from './engine.js';
import { Scenario } from './types.js';

// Minimal Node typings to avoid pulling in @types/node.
declare const process: {
  stdin: {
    setEncoding: (enc: string) => void;
    on: (event: string, listener: (...args: unknown[]) => void) => void;
  };
  stdout: { write: (chunk: string) => boolean };
  stderr: { write: (chunk: string) => boolean };
  exit: (code: number) => never;
};

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk: unknown) => {
      data += String(chunk);
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

async function main(): Promise<void> {
  const raw = await readStdin();
  const scenario = JSON.parse(raw) as Scenario;
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result) + '\n');
}

main().catch((err) => {
  process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
