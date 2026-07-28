import { processScenario } from "./claim-office.js";

// Minimal ambient declarations for the Node globals used below, so the CLI
// type-checks without pulling in @types/node.
declare const process: {
  stdin: AsyncIterable<Uint8Array>;
  stdout: { write(data: string): void };
  stderr: { write(data: string): void };
  exit(code: number): never;
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
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input);
    const output = processScenario(scenario);
    process.stdout.write(JSON.stringify(output));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
};

void main();
