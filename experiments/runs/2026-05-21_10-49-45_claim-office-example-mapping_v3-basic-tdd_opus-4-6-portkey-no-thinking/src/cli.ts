import { runScenario } from './engine.js';
import type { Scenario } from './engine.js';

async function main() {
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input);
  } catch {
    process.stderr.write('Error: Invalid JSON input\n');
    process.exit(1);
  }

  try {
    const results = runScenario(scenario);
    process.stdout.write(JSON.stringify({ results }) + '\n');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: ${message}\n`);
    process.exit(1);
  }
}

main();
