import { scoreArmy, type Card } from "./sphinx-score.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  const { army } = JSON.parse(input) as { army: Card[] };
  process.stdout.write(JSON.stringify({ score: scoreArmy(army) }) + "\n");
};

await main();
