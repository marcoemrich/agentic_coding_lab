import { readFileSync } from 'node:fs';
import { processScenario } from './office.js';

try {
  const scenario = JSON.parse(readFileSync(0, 'utf8'));
  console.log(JSON.stringify(processScenario(scenario)));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
