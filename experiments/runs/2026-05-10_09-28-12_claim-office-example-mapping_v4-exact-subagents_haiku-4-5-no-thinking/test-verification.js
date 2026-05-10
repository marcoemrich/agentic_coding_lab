import { processClaim } from './src/claim-office.ts';

const result = processClaim(400, 100, undefined, true);
console.log(`processClaim(400, 100, undefined, true) = ${result}`);
console.log(`Expected: 300`);
console.log(`Test ${result === 300 ? 'PASSED' : 'FAILED'}`);
