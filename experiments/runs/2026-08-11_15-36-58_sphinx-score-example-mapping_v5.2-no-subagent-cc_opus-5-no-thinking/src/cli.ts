import { sphinxScore, type Card } from "./sphinx-score.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
};

const input = await readStdin();
const { army } = JSON.parse(input) as { army: Card[] };

process.stdout.write(JSON.stringify({ score: sphinxScore(army) }));
