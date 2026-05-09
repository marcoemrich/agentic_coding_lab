import { processScenario } from './scenario.js';
import type { Scenario } from './types.js';

async function main(): Promise<void> {
  // Read all of stdin
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const input = Buffer.concat(chunks).toString('utf-8');

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch {
    process.stderr.write('Invalid JSON input\n');
    process.exit(1);
  }

  try {
    const output = processScenario(scenario);
    process.stdout.write(JSON.stringify(output) + '\n');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: ${message}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  process.stderr.write(`Unexpected error: ${String(err)}\n`);
  process.exit(1);
});
