import { runScenario } from './scenario.js';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  const input = await readStdin();

  // Nothing is written to stdout until the whole scenario has succeeded, so a
  // rejected scenario produces no partial results.
  const results = runScenario(JSON.parse(input));

  process.stdout.write(JSON.stringify({ results }) + '\n');
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
