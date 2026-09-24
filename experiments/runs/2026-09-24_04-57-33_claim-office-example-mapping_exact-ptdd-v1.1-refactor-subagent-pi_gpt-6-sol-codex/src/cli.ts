import { readFileSync } from 'node:fs';
import { processScenario, type Scenario } from './scenario.js';

try {
  const input = JSON.parse(readFileSync(0, 'utf8')) as Scenario;
  process.stdout.write(JSON.stringify(processScenario(input)));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
