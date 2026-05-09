import { processScenario } from './engine.js';

async function main() {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  const input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  const output = processScenario(input);
  process.stdout.write(JSON.stringify(output) + '\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
