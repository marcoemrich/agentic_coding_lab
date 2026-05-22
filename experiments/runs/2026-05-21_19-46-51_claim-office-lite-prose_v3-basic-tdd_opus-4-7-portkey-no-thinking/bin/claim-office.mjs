#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const cli = resolve(here, '..', 'src', 'cli.ts');
const tsx = resolve(here, '..', 'node_modules', '.bin', 'tsx');

const result = spawnSync(tsx, [cli], { stdio: 'inherit' });
process.exit(result.status ?? 1);
