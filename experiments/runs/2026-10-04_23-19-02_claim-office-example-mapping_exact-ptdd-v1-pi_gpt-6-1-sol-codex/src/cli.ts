import { readFileSync } from 'node:fs';
import { runScenario, type Scenario } from './office.js';

try {
  const scenario: Scenario = JSON.parse(readFileSync(0, 'utf8'));
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
