import { scoreArmy, type Card } from "./sphinx-score.js";

const readStdin = async (): Promise<string> => {
  let input = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) input += chunk;
  return input;
};

const parseArmy = (request: string): Card[] => JSON.parse(request).army;

const renderScore = (score: number): string => JSON.stringify({ score });

process.stdout.write(renderScore(scoreArmy(parseArmy(await readStdin()))));
