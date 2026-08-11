import { scoreArmy, type Card } from "./sphinx-score.js";

/**
 * Minimal shape of the Node globals this entry point needs. Declared locally
 * because the project does not depend on @types/node.
 */
declare const process: {
  /** Yields strings rather than buffers because `setEncoding` is called first. */
  stdin: AsyncIterable<string> & {
    setEncoding(encoding: string): void;
  };
  stdout: { write(text: string): void };
};

const readStdin = async (): Promise<string> => {
  process.stdin.setEncoding("utf8");
  const chunks: string[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return chunks.join("");
};

const main = async (): Promise<void> => {
  const { army } = JSON.parse(await readStdin()) as { army: Card[] };
  process.stdout.write(`${JSON.stringify({ score: scoreArmy(army) })}\n`);
};

await main();
