import { scoreArmy, type Card } from "./sphinx-score.js";

async function readStdin(): Promise<string> {
  process.stdin.setEncoding("utf8");
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
  return input;
}

const { army } = JSON.parse(await readStdin()) as { army: Card[] };
process.stdout.write(JSON.stringify({ score: scoreArmy(army) }) + "\n");
