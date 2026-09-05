import { readFileSync } from 'node:fs';
import { run } from './office.js';
process.stdout.write(JSON.stringify(run(JSON.parse(readFileSync(0, 'utf8')))));
