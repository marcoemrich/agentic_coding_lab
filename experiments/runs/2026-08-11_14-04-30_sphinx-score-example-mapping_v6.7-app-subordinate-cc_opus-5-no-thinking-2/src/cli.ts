import { scoreArmy, type Card } from "./sphinx-score.js";

const readAllText = async (stream: NodeJS.ReadStream): Promise<string> => {
  let text = "";
  for await (const chunk of stream) text += chunk;
  return text;
};

const scoreResponseFor = (requestJson: string): string => {
  const { army } = JSON.parse(requestJson) as { army: Card[] };
  return JSON.stringify({ score: scoreArmy(army) });
};

const main = async (): Promise<void> => {
  const requestJson = await readAllText(process.stdin);
  process.stdout.write(scoreResponseFor(requestJson));
};

await main();
