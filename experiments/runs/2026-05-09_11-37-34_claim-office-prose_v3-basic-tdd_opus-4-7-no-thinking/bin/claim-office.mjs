#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const tsx = resolve(root, 'node_modules', '.bin', 'tsx');
const cliEntry = resolve(root, 'src', 'cli.ts');

const result = spawnSync(tsx, [cliEntry], { stdio: 'inherit' });
process.exit(result.status ?? 1);
