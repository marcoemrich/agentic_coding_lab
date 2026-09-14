import { runScenario, Scenario } from './scenario.js';

export function processScenarioJson(input: string): string {
  const scenario = JSON.parse(input) as Scenario;
  if (!scenario || typeof scenario !== 'object') {
    throw new Error('scenario must be a JSON object');
  }
  if (!scenario.customer || typeof scenario.customer.yearsWithMHPCO !== 'number') {
    throw new Error('scenario must have a customer with yearsWithMHPCO');
  }
  if (!Array.isArray(scenario.steps)) {
    throw new Error('scenario must have a steps array');
  }
  return JSON.stringify({ results: runScenario(scenario) });
}
