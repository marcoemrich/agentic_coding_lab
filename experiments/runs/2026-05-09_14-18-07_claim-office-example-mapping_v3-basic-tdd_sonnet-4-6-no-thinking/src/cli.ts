import { runScenario } from './scenario.js';

async function main() {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  const input = JSON.parse(Buffer.concat(chunks).toString('utf8'));

  try {
    const output = runScenario(input);
    process.stdout.write(JSON.stringify(output) + '\n');
  } catch (err) {
    process.stderr.write(String(err instanceof Error ? err.message : err) + '\n');
    process.exit(1);
  }
}

main().catch(err => {
  process.stderr.write(String(err instanceof Error ? err.message : err) + '\n');
  process.exit(1);
});
