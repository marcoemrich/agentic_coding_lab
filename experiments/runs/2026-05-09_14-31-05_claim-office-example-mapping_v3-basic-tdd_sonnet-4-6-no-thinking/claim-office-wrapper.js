#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Use tsx to run the TypeScript CLI directly
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const result = spawnSync(
  process.execPath,
  ['--import', 'tsx', join(__dirname, 'src/cli.ts')],
  {
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '' },
  }
);

process.exit(result.status ?? 1);
