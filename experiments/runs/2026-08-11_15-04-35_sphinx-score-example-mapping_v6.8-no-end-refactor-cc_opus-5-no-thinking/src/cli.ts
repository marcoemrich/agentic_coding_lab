import { scoreArmy, type Card } from "./sphinx-score.js";

declare const process: {
  stdin: AsyncIterable<string | { toString(encoding: string): string }>;
  stdout: { write(text: string): void };
};

const readStdin = async (): Promise<string> => {
  let input = "";
  for await (const chunk of process.stdin) {
    input += typeof chunk === "string" ? chunk : chunk.toString("utf8");
  }
  return input;
};

const main = async (): Promise<void> => {
  const { army } = JSON.parse(await readStdin()) as { army: Card[] };
  process.stdout.write(JSON.stringify({ score: scoreArmy(army) }) + "\n");
};

await main();
