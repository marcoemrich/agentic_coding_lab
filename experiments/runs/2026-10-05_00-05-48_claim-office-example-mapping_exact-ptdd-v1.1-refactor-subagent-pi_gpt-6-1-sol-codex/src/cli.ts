import { readFileSync } from 'node:fs';
import { processScenario } from './office.js';

function processScenarioJson(input: string): string {
  const scenario: unknown = JSON.parse(input);
  return JSON.stringify(processScenario(scenario));
}

process.stdout.write(processScenarioJson(readFileSync(0, 'utf8')));
