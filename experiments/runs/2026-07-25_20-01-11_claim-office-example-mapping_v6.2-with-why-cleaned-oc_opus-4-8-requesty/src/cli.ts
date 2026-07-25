import { runScenario } from "./claim-office.js";

// Minimal ambient declarations for the Node.js globals used here,
// avoiding a dependency on @types/node.
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
  input += decoder.decode();
  return input;
};

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input);
    const output = runScenario(scenario);
    process.stdout.write(JSON.stringify(output));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
};

main();
