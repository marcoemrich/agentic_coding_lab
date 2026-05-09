#!/usr/bin/env node
// Wrapper that invokes the TS CLI via tsx so the entry point can stay at src/cli.ts.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const cliPath = resolve(here, '..', 'src', 'cli.ts');
const tsxBin = resolve(here, '..', 'node_modules', '.bin', 'tsx');

const child = spawn(tsxBin, [cliPath], { stdio: 'inherit' });
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
