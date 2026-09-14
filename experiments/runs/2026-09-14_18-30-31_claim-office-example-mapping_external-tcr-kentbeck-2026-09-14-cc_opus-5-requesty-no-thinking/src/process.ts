import { runScenario, Scenario } from './scenario.js';

export function processInput(input: string): string {
  const scenario = JSON.parse(input) as Scenario;
  if (!scenario || typeof scenario !== 'object' || !Array.isArray(scenario.steps)) {
    throw new Error('Invalid scenario: expected an object with a steps array');
  }
  return JSON.stringify({ results: runScenario(scenario) });
}
