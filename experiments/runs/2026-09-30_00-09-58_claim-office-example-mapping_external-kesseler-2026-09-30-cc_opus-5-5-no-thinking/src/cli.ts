#!/usr/bin/env tsx
import { readFileSync } from 'node:fs';
import { runCli } from './claim-office';

const output = runCli(readFileSync(0, 'utf8'));
process.stdout.write(output.stdout);
process.stderr.write(output.stderr);
process.exitCode = output.exitCode;
