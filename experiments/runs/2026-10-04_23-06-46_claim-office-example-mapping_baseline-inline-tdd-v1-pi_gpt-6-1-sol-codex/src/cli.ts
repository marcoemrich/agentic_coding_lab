import { readFileSync } from 'node:fs';
import { processScenario } from './office';
import { validateScenario } from './input';

try {
  const scenario: unknown = JSON.parse(readFileSync(0, 'utf8'));
  validateScenario(scenario);
  const result = processScenario(scenario);
  process.stdout.write(JSON.stringify(result) + '\n');
} catch (error) {
  process.stderr.write(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
