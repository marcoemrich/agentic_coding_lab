#!/usr/bin/env node
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use tsx to run the TypeScript CLI
import { spawnSync } from 'child_process';
const result = spawnSync(
  process.execPath,
  ['--import', 'tsx', join(__dirname, '../src/cli.ts')],
  {
    stdio: 'inherit',
    env: process.env,
  }
);
process.exit(result.status ?? 0);
