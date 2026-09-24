import { readFileSync } from 'node:fs';
import { processScenario } from './claim-office.js';

const scenario = JSON.parse(readFileSync(0, 'utf8')) as Parameters<typeof processScenario>[0];
process.stdout.write(JSON.stringify(processScenario(scenario)));
