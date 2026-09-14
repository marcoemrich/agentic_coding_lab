import { runScenario, type Scenario } from './scenario';

export function handle(input: string): string {
  const scenario = JSON.parse(input) as Scenario;
  return JSON.stringify({ results: runScenario(scenario) });
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  try {
    process.stdout.write(handle(await readStdin()));
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exitCode = 1;
  }
}

void main();
