import { scoreArmy, type Card } from './sphinx-score.js';

interface ArmyDocument {
  army: Card[];
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }

  return Buffer.concat(chunks).toString('utf8');
}

const input = JSON.parse(await readStdin()) as ArmyDocument;

process.stdout.write(`${JSON.stringify({ score: scoreArmy(input.army) })}\n`);
