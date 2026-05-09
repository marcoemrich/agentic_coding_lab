#!/usr/bin/env node
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tsx = join(__dirname, '..', 'node_modules', '.bin', 'tsx');
const cli = join(__dirname, '..', 'src', 'cli.ts');

const result = spawnSync(tsx, [cli], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
