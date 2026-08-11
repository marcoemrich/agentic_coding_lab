import { pathToFileURL } from "node:url";
import { scoreArmy, type Card } from "./sphinx-score.js";

export const scoreArmyDocument = (inputJson: string): string => {
  const document = JSON.parse(inputJson) as { army: Card[] };
  return JSON.stringify({ score: scoreArmy(document.army) });
};

const readAll = async (stream: NodeJS.ReadableStream): Promise<string> => {
  const chunks: string[] = [];
  stream.setEncoding("utf8");
  for await (const chunk of stream) chunks.push(chunk as string);
  return chunks.join("");
};

// True only when this module is the script node was launched with, so importing
// it from a test never consumes stdin.
const isEntryPoint =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntryPoint) {
  process.stdout.write(scoreArmyDocument(await readAll(process.stdin)));
}
