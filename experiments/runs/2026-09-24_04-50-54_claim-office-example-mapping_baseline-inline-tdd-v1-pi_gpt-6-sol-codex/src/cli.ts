import { runScenario, type Scenario } from './office.js';

try {
  const input = await new Promise<string>((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk: string) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
  const scenario = JSON.parse(input) as Scenario;
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output) + '\n');
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
