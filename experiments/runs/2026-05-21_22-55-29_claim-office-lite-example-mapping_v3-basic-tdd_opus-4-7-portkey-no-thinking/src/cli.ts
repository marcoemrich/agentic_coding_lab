import { runScenario } from './scenario.js';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input);
    const out = runScenario(scenario);
    process.stdout.write(JSON.stringify(out));
  } catch (err) {
    process.stderr.write(
      (err instanceof Error ? err.message : String(err)) + '\n'
    );
    process.exit(1);
  }
}

main();
