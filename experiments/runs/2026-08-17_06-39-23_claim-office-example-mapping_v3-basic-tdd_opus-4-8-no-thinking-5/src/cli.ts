import { runScenario, type Scenario } from './scenario';

/** Read all of stdin as a string. */
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

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch (err) {
    process.stderr.write(`Invalid JSON input: ${(err as Error).message}\n`);
    process.exitCode = 1;
    return;
  }

  try {
    const results = runScenario(scenario);
    process.stdout.write(JSON.stringify({ results }) + '\n');
  } catch (err) {
    process.stderr.write(`${(err as Error).message}\n`);
    process.exitCode = 1;
  }
}

void main();
