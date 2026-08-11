import { scoreArmy, type Card } from "./sphinx-score.js";

declare const process: {
  stdin: AsyncIterable<Uint8Array>;
  stdout: { write: (text: string) => void };
};

const readStdin = async (): Promise<string> => {
  const decoder = new TextDecoder();
  let input = "";
  for await (const chunk of process.stdin) {
    input += decoder.decode(chunk, { stream: true });
  }
  return input + decoder.decode();
};

const main = async (): Promise<void> => {
  const { army } = JSON.parse(await readStdin()) as { army: Card[] };
  process.stdout.write(`${JSON.stringify({ score: scoreArmy(army) })}\n`);
};

await main();
