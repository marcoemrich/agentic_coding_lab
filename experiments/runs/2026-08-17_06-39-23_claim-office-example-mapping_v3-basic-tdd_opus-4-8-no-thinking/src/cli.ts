import { runScenario } from './scenario.js';
import type { Scenario } from './types.js';

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

async function main(): Promise<void> {
  const input = await readStdin();
  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch (err) {
    throw new Error(`Invalid JSON input: ${(err as Error).message}`);
  }

  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
