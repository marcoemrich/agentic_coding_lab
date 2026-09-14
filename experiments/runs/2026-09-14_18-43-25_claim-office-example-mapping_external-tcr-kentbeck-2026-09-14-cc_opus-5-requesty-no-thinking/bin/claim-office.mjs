#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const tsx = fileURLToPath(new URL('../node_modules/.bin/tsx', import.meta.url));
const cli = fileURLToPath(new URL('../src/cli.ts', import.meta.url));

const result = spawnSync(tsx, [cli], { stdio: 'inherit' });
process.exit(result.status ?? 1);
