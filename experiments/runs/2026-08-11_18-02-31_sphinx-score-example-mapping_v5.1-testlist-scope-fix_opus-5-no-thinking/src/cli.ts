import { scoreArmy, type Card } from "./sphinx-score.js";

declare const process: {
  stdin: AsyncIterable<Uint8Array>;
  stdout: { write(text: string): void };
};

/** Reads the whole of stdin before producing output. */
async function readStdin(): Promise<string> {
  const decoder = new TextDecoder();
  let text = "";
  for await (const chunk of process.stdin) text += decoder.decode(chunk, { stream: true });
  return text + decoder.decode();
}

const input = JSON.parse(await readStdin()) as { army: Card[] };
process.stdout.write(JSON.stringify({ score: scoreArmy(input.army) }));
