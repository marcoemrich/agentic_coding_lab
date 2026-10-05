import { processScenario } from './scenario.js';
process.stdin.setEncoding('utf8');
let input = '';
process.stdin.on('data', (chunk: string) => { input += chunk; });
process.stdin.on('end', () => {
  const scenario = JSON.parse(input);
  const results = processScenario(scenario);
  process.stdout.write(JSON.stringify({ results }));
});
