import { runScenario } from "./scenario.js";

// Minimal ambient declaration for the Node.js process object used by this
// CLI entry point, avoiding a dependency on @types/node.
declare const process: {
  stdin: {
    setEncoding(encoding: string): void;
    on(event: string, listener: (chunk: string) => void): void;
  };
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exit(code: number): never;
};

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

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

void main();
