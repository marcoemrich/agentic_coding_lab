import { runScenario, type Scenario } from './scenario.js';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  const input = await readStdin();
  const scenario = JSON.parse(input) as Scenario;
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output) + '\n');
}

main().catch(err => {
  process.stderr.write(String(err) + '\n');
  process.exit(1);
});
