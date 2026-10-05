import { readFileSync } from 'node:fs';
import { processScenario } from './office';

try {
  const scenario = JSON.parse(readFileSync(0, 'utf8'));
  const output = processScenario(scenario);
  process.stdout.write(JSON.stringify(output) + '\n');
} catch (error) {
  process.stderr.write(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
