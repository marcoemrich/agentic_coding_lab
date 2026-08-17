import { runScenario, Scenario } from './scenario';

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

async function main(): Promise<void> {
  const input = await readStdin();
  const scenario = JSON.parse(input) as Scenario;
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`claim-office error: ${message}\n`);
  process.exit(1);
});
