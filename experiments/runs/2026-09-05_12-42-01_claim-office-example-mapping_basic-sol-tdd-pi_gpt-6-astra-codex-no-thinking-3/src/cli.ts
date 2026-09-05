import { readFileSync } from 'node:fs';
import { processScenario, type Scenario } from './office.js';
const scenario = JSON.parse(readFileSync(0, 'utf8')) as Scenario;
console.log(JSON.stringify(processScenario(scenario)));
