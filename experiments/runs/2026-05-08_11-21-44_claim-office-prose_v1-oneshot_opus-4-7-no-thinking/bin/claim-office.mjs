#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const cliEntry = resolve(here, '..', 'src', 'cli.ts');
const tsxBin = resolve(here, '..', 'node_modules', '.bin', 'tsx');

const result = spawnSync(tsxBin, [cliEntry], {
  stdio: 'inherit',
});
process.exit(result.status ?? 0);
