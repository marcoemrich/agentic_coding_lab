import { runScenario, type Scenario } from "./claim-office.js";

// Minimal ambient declaration for the Node.js `process` global, avoiding a
// dependency on @types/node while keeping the type-checker satisfied.
declare const process: {
  stdin: {
    setEncoding(encoding: string): void;
    on(event: string, listener: (chunk: string) => void): void;
  };
  stdout: { write(data: string): void };
  stderr: { write(data: string): void };
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
    const scenario = JSON.parse(input) as Scenario;
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
};

void main();
