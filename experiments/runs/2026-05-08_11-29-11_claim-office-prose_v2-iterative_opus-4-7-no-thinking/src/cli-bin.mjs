#!/usr/bin/env node
// Wrapper that runs the TypeScript CLI via tsx.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const cli = resolve(here, 'cli.ts');
const tsx = resolve(here, '..', 'node_modules', '.bin', 'tsx');

const child = spawn(tsx, [cli], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
