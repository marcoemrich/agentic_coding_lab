import { scoreArmy, type Card } from "./sphinx-score.js";

type ArmyDocument = { army: Card[] };

export const scoreDocument = (armyDocument: string): string => {
  const { army } = JSON.parse(armyDocument) as ArmyDocument;
  return JSON.stringify({ score: scoreArmy(army) });
};

const readAll = async (input: AsyncIterable<string>): Promise<string> => {
  const chunks: string[] = [];
  for await (const chunk of input) chunks.push(chunk);
  return chunks.join("");
};

const wasInvokedAsCommand = process.argv[1]?.endsWith("cli.ts");

if (wasInvokedAsCommand) {
  process.stdin.setEncoding("utf8");
  readAll(process.stdin).then((document) => {
    process.stdout.write(scoreDocument(document));
  });
}
