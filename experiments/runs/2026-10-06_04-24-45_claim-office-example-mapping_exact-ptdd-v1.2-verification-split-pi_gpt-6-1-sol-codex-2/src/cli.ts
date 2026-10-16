import { readFileSync } from 'node:fs';
import { execute } from './office.js';

const input: unknown = JSON.parse(readFileSync(0, 'utf8'));
process.stdout.write(JSON.stringify(execute(input)) + '\n');
