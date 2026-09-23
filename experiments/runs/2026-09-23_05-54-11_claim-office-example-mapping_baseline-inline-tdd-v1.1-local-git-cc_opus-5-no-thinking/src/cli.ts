import { runScenario, Scenario } from './scenario.js';

/** Reads the whole of stdin as UTF-8 text. */
async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  const input = await readStdin();

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch (error) {
    throw new Error(`Invalid JSON on stdin: ${(error as Error).message}`);
  }

  // Nothing is written to stdout unless the whole scenario succeeds.
  const results = runScenario(scenario);
  process.stdout.write(JSON.stringify({ results }));
}

main().catch((error: Error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
