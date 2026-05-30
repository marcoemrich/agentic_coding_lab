import { runScenario } from "./claim-office.js";

// Minimal ambient declarations for the Node globals this CLI uses, so the
// source type-checks without pulling in a full @types/node dependency.
declare const process: {
  stdin: AsyncIterable<unknown>;
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exit(code: number): never;
};

const readStdin = async (): Promise<string> => {
  const chunks: string[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(String(chunk));
  }
  return chunks.join("");
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = JSON.parse(input);
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output));
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
