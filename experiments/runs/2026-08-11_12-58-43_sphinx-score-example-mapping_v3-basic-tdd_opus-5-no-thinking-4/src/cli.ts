import { scoreArmy, type Card } from './sphinx-score.js';

// Minimal shape of the Node globals this entry point needs. The project does
// not depend on @types/node, so the pieces used here are declared locally.
declare const process: {
  stdin: AsyncIterable<{ toString(encoding: string): string }> & { setEncoding(e: string): void };
  stdout: { write(chunk: string): void };
};

interface ArmyDocument {
  army: Card[];
}

async function readStdin(): Promise<string> {
  process.stdin.setEncoding('utf8');
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input;
}

const document = JSON.parse(await readStdin()) as ArmyDocument;
process.stdout.write(`${JSON.stringify({ score: scoreArmy(document.army) })}\n`);
