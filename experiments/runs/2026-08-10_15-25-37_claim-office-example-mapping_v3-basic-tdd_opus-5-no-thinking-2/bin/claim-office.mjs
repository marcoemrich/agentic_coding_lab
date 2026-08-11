#!/usr/bin/env node
// Runs the TypeScript CLI entry point through tsx, so `claim-office` works
// straight from the source tree without a separate build step.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const entry = fileURLToPath(new URL('../src/cli.ts', import.meta.url));
const tsx = fileURLToPath(new URL('../node_modules/tsx/dist/cli.mjs', import.meta.url));

const { status } = spawnSync(process.execPath, [tsx, entry, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

process.exit(status ?? 1);
