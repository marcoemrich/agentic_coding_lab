import { sphinxScore, type Army } from './sphinx-score.js';

// Minimal ambient declarations for the Node globals used below, so the CLI
// typechecks without pulling in @types/node.
declare const process: {
  stdin: AsyncIterable<string | Uint8Array> & { setEncoding(enc: string): void };
  stdout: { write(chunk: string): void };
  stderr: { write(chunk: string): void };
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
  const { army } = JSON.parse(input) as { army: Army };

  process.stdout.write(`${JSON.stringify({ score: sphinxScore(army) })}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
});
