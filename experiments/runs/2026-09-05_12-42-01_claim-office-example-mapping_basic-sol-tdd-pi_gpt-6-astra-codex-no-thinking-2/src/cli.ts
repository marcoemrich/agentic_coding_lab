import { readFileSync } from 'node:fs';
import { runScenario } from './office.js';

try {
  console.log(JSON.stringify(runScenario(JSON.parse(readFileSync(0, 'utf8')))));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
