import { processScenario } from './claim-office.js';

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

async function main() {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input);
    const output = processScenario(scenario);
    process.stdout.write(JSON.stringify(output) + '\n');
  } catch (err: any) {
    process.stderr.write(err.message + '\n');
    process.exit(1);
  }
}

main();
