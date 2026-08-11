import { scoreArmy, type Card } from "./sphinx-score.js";

const readStdin = async (): Promise<string> =>
  Buffer.concat(await process.stdin.toArray()).toString("utf8");

const { army } = JSON.parse(await readStdin()) as { army: Card[] };

process.stdout.write(`${JSON.stringify({ score: scoreArmy(army) })}\n`);
