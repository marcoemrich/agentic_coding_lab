import { readFileSync } from 'node:fs';
import { processScenario, type Scenario } from './scenario.js';

const scenario: Scenario = JSON.parse(readFileSync(0, 'utf8'));
process.stdout.write(JSON.stringify({ results: processScenario(scenario) }));
