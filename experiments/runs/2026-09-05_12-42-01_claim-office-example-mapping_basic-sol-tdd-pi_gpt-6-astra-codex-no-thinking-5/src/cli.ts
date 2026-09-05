import { readFileSync } from 'node:fs';
import { run, type Scenario } from './office.js';

try {
  const scenario = JSON.parse(readFileSync(0, 'utf8')) as Scenario;
  console.log(JSON.stringify(run(scenario)));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
