#!/usr/bin/env -S npx tsx
import { processScenario, parseScenario } from './claim-office.js';

async function main(): Promise<void> {
  const input = await new Promise<string>((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk: string) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
  const scenario = parseScenario(JSON.parse(input));
  process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`claim-office: ${message}\n`);
  process.exitCode = 1;
});
