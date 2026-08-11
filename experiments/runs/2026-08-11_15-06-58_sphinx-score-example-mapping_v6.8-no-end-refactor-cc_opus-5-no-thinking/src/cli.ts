import { scoreArmy, type Card } from "./sphinx-score.js";

type ArmyDocument = { army: Card[] };
type ScoreDocument = { score: number };

const readAllOfStdin = async (): Promise<string> => {
  const chunks: string[] = [];
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) chunks.push(chunk);
  return chunks.join("");
};

const parseArmyDocument = (json: string): ArmyDocument =>
  JSON.parse(json) as ArmyDocument;

const formatScoreDocument = (score: number): string =>
  JSON.stringify({ score } satisfies ScoreDocument);

const { army } = parseArmyDocument(await readAllOfStdin());
process.stdout.write(formatScoreDocument(scoreArmy(army)));
