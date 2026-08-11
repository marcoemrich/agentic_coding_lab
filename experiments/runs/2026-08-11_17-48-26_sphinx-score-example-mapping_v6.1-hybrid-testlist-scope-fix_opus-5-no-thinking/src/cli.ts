import { sphinxScore, type Card } from "./sphinx-score.js";

declare const process: {
  stdin: AsyncIterable<{ toString(encoding: string): string }>;
  stdout: { write(text: string): void };
};

const readStdin = async (): Promise<string> => {
  let input = "";
  for await (const chunk of process.stdin) input += chunk.toString("utf8");
  return input;
};

const { army } = JSON.parse(await readStdin()) as { army: Card[] };
process.stdout.write(JSON.stringify({ score: sphinxScore(army) }) + "\n");
