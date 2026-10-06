#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { runScenario, type Scenario } from './office.js';

const scenario: Scenario = JSON.parse(readFileSync(0, 'utf8'));
process.stdout.write(JSON.stringify(runScenario(scenario)) + '\n');
