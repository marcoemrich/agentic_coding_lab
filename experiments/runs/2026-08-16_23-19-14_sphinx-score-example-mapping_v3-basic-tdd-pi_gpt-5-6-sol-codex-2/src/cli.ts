import { scoreSphinxes, type Card } from "./sphinx-score.js";

type ArmyDocument = { army: Card[] };

async function readStdin(): Promise<string> {
  process.stdin.setEncoding("utf8");
  const chunks: string[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  return chunks.join("");
}

const document = JSON.parse(await readStdin()) as ArmyDocument;
process.stdout.write(`${JSON.stringify({ score: scoreSphinxes(document.army) })}\n`);
