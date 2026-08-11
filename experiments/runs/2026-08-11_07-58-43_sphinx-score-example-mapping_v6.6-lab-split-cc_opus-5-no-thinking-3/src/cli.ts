import { scoreArmy, type Card } from "./sphinx-score.js";

const readAllText = async (stream: NodeJS.ReadStream): Promise<string> => {
  const chunks: string[] = [];
  stream.setEncoding("utf8");
  for await (const chunk of stream) chunks.push(chunk);
  return chunks.join("");
};

/** The CLI speaks JSON both ways: `{"army":[...]}` in, `{"score":n}` out. */
const scoreArmyJson = (requestJson: string): string => {
  const { army } = JSON.parse(requestJson) as { army: Card[] };
  return JSON.stringify({ score: scoreArmy(army) });
};

process.stdout.write(scoreArmyJson(await readAllText(process.stdin)));
