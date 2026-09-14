import { runScenario, Scenario } from './scenario.js';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

/**
 * Reads a scenario as JSON from stdin and writes `{"results": [...]}` to
 * stdout. Any rejected scenario — an unknown item type, a damage outside the
 * policy, a negative amount — exits non-zero with a description on stderr and
 * writes nothing to stdout.
 */
async function main(): Promise<void> {
  try {
    const scenario = JSON.parse(await readStdin()) as Scenario;
    const results = runScenario(scenario);
    process.stdout.write(JSON.stringify({ results }) + '\n');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exitCode = 1;
  }
}

void main();
