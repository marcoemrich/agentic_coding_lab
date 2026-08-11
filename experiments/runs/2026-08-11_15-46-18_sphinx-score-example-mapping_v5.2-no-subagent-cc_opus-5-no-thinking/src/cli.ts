import { scoreArmy, type Card } from "./sphinx-score.js";

const readStdin = async (): Promise<string> => {
  let input = "";
  const decoder = new TextDecoder();

  for await (const chunk of process.stdin) {
    input += decoder.decode(chunk as Uint8Array, { stream: true });
  }

  return input + decoder.decode();
};

const main = async (): Promise<void> => {
  const { army } = JSON.parse(await readStdin()) as { army: Card[] };

  process.stdout.write(`${JSON.stringify({ score: scoreArmy(army) })}\n`);
};

await main();
