import { processScenario, AppError } from './engine.js';
import type { Scenario } from './types.js';

async function main(): Promise<void> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  const input = Buffer.concat(chunks).toString('utf-8');

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch (err) {
    process.stderr.write(`Error: invalid JSON input: ${(err as Error).message}\n`);
    process.exit(1);
  }

  let results;
  try {
    results = processScenario(scenario);
  } catch (err) {
    if (err instanceof AppError) {
      process.stderr.write(`Error: ${err.message}\n`);
      process.exit(1);
    }
    throw err;
  }

  process.stdout.write(JSON.stringify({ results }) + '\n');
}

main().catch(err => {
  process.stderr.write(`Fatal: ${(err as Error).message}\n`);
  process.exit(1);
});
