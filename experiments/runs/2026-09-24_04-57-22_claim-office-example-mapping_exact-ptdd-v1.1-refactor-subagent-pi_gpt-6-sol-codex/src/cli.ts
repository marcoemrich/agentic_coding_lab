import { readFileSync } from 'node:fs';
import { scenarioResults, type Step } from './scenario-results.js';

const scenario = JSON.parse(readFileSync(0, 'utf8')) as { customer: { yearsWithMHPCO: number }; steps: Step[] };
process.stdout.write(JSON.stringify({ results: scenarioResults(scenario.steps, scenario.customer.yearsWithMHPCO) }));
