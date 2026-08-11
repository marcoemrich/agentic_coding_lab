import { scoreArmy, type Card } from "./sphinx-score.js";

const readStdin = async (): Promise<string> => {
  let input = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) input += chunk;
  return input;
};

const main = async (): Promise<void> => {
  const { army } = JSON.parse(await readStdin()) as { army: Card[] };
  process.stdout.write(JSON.stringify({ score: scoreArmy(army) }));
};

await main();
