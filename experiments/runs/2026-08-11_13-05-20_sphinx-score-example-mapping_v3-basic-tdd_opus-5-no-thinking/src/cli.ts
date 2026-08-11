import { scoreArmy, type Card } from './sphinx-score.js';

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  const { army } = JSON.parse(input) as { army: Card[] };

  process.stdout.write(`${JSON.stringify({ score: scoreArmy(army) })}\n`);
};

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
});
