#!/usr/bin/env -S npx --no-install tsx
import { readFileSync } from 'node:fs';
import { run, type Scenario } from './office.js';

const scenario = JSON.parse(readFileSync(0, 'utf8')) as Scenario;
process.stdout.write(JSON.stringify(run(scenario)) + '\n');
