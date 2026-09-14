#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const result = spawnSync(
  process.execPath,
  [join(root, 'node_modules', 'tsx', 'dist', 'cli.mjs'), join(root, 'src', 'cli.ts')],
  { stdio: 'inherit' },
);
process.exit(result.status ?? 1);
