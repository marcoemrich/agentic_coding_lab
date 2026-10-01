import { readFileSync } from 'node:fs';
import { runScenario } from './scenario';

try {
  const scenario = JSON.parse(readFileSync(0, 'utf8'));
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exitCode = 1;
}
