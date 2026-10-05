import { readFileSync } from 'node:fs';
import { processScenario } from './office';

try {
  const input: unknown = JSON.parse(readFileSync(0, 'utf8'));
  const output = processScenario(input);
  process.stdout.write(JSON.stringify(output) + '\n');
} catch (error) {
  process.stderr.write((error instanceof Error ? error.message : String(error)) + '\n');
  process.exitCode = 1;
}
