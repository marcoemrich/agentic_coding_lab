import { scoreArmy, type Card } from "./sphinx-score.js";

const readStdin = async (): Promise<string> => {
  process.stdin.setEncoding("utf8");
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
  return input;
};

const main = async (): Promise<void> => {
  const input = JSON.parse(await readStdin()) as { army: Card[] };
  process.stdout.write(JSON.stringify({ score: scoreArmy(input.army) }) + "\n");
};

await main();
