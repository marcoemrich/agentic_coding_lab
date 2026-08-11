import { scoreArmy, type Card } from "./sphinx-score.js";

const readStdin = async (): Promise<string> => {
  process.stdin.setEncoding("utf8");
  const chunks: string[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as string);
  }
  return chunks.join("");
};

type ArmyRequest = { army: Card[] };

const request = JSON.parse(await readStdin()) as ArmyRequest;

process.stdout.write(JSON.stringify({ score: scoreArmy(request.army) }));
