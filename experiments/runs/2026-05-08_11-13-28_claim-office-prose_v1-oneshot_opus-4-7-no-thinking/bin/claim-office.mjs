#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = resolve(__dirname, '..', 'src', 'cli.ts');
const tsxBin = resolve(__dirname, '..', 'node_modules', '.bin', 'tsx');

const result = spawnSync(tsxBin, [cliPath], { stdio: 'inherit' });
process.exit(result.status ?? 1);
