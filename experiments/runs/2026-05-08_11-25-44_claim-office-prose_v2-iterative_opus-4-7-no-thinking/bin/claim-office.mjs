#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const cli = path.join(here, '..', 'src', 'cli.ts');
const tsx = path.join(here, '..', 'node_modules', '.bin', 'tsx');

const r = spawnSync(tsx, [cli], { stdio: 'inherit' });
process.exit(r.status ?? 1);
