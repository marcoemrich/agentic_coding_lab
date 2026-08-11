import { fileURLToPath } from "node:url";
import { scoreArmy, type Card } from "./sphinx-score.js";

interface ArmyDocument {
  army: Card[];
}

export const scoreDocument = (input: string): string => {
  const { army } = JSON.parse(input) as ArmyDocument;
  return JSON.stringify({ score: scoreArmy(army) });
};

const readAll = async (stream: AsyncIterable<Buffer>): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
};

const isEntryPoint = process.argv[1] === fileURLToPath(import.meta.url);

if (isEntryPoint) {
  process.stdout.write(scoreDocument(await readAll(process.stdin)));
}
