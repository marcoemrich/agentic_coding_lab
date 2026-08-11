import { scoreArmy, type Card } from "./sphinx-score.js";

declare const process: {
  stdin: AsyncIterable<string | Uint8Array> & { setEncoding(enc: string): void };
  stdout: { write(text: string): void };
};

const readStdin = async (): Promise<string> => {
  process.stdin.setEncoding("utf8");
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
  return input;
};

const main = async (): Promise<void> => {
  const { army } = JSON.parse(await readStdin()) as { army: Card[] };
  process.stdout.write(JSON.stringify({ score: scoreArmy(army) }) + "\n");
};

await main();
