import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const resultsFor = (input: string): string =>
  JSON.stringify(runScenario(JSON.parse(input) as Scenario));

/**
 * Everything that can fail happens before anything is written, so a rejected
 * scenario leaves stdout empty rather than half-written.
 */
const main = async (): Promise<void> => {
  const input = await readStdin();
  try {
    const results = resultsFor(input);
    process.stdout.write(results);
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exitCode = 1;
  }
};

await main();
