import { runScenario, type Scenario } from './scenario';

export function processInput(input: string): string {
  const scenario = JSON.parse(input) as Scenario;
  return JSON.stringify(runScenario(scenario));
}
