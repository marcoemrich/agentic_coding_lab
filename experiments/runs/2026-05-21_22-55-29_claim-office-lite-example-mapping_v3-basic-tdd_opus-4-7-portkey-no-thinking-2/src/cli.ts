import { runScenario, Scenario } from './scenario.js';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input) as Scenario;
    const output = runScenario(scenario);
    process.stdout.write(JSON.stringify(output) + '\n');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: ${message}\n`);
    process.exit(1);
  }
}

main();
