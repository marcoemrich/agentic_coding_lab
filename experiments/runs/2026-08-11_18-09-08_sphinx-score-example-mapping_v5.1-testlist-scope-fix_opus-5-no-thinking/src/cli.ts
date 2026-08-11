import { scoreArmy, type Card } from "./sphinx-score.js";

// Minimal ambient declarations: @types/node is not a dependency of this kata.
declare const process: {
  stdin: AsyncIterable<string | { toString(encoding: string): string }>;
  stdout: { write(text: string): void };
};

async function readStdin(): Promise<string> {
  let input = "";
  for await (const chunk of process.stdin) {
    input += typeof chunk === "string" ? chunk : chunk.toString("utf8");
  }
  return input;
}

const { army } = JSON.parse(await readStdin()) as { army: Card[] };
process.stdout.write(JSON.stringify({ score: scoreArmy(army) }) + "\n");
