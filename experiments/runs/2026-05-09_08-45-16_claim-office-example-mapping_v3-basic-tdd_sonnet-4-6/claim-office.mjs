#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Run the CLI via tsx for TypeScript support
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cli = join(__dirname, 'src', 'cli.ts');

const result = spawnSync(
  process.execPath,
  ['--import', 'tsx/esm', cli],
  { stdio: 'inherit', env: process.env }
);

process.exit(result.status ?? 1);
