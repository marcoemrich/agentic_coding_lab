#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const cli = fileURLToPath(new URL('../src/cli.ts', import.meta.url));
const { status } = spawnSync('node', ['--import', 'tsx', cli], { stdio: 'inherit' });
process.exit(status ?? 1);
