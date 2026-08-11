import { scoreArmy, type Card } from './sphinx-score.js';

// Minimal ambient declaration for the Node globals this entry point uses;
// the project does not depend on @types/node.
declare const process: {
  stdin: AsyncIterable<string | Uint8Array> & { setEncoding(encoding: string): void };
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exitCode: number;
};

async function readStdin(): Promise<string> {
  process.stdin.setEncoding('utf8');
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input;
}

async function main(): Promise<void> {
  const input = await readStdin();
  const { army } = JSON.parse(input) as { army: Card[] };
  process.stdout.write(`${JSON.stringify({ score: scoreArmy(army) })}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
