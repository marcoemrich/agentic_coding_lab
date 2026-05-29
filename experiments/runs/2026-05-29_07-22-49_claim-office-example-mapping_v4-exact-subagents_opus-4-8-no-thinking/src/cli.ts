import { runScenario, type Scenario } from "./claim-office.js";

// Minimal ambient declaration for the Node globals the CLI uses, avoiding a
// dependency on @types/node (not installed in this project).
declare const process: {
  stdin: {
    setEncoding(encoding: string): void;
    on(event: "data", listener: (chunk: string) => void): void;
    on(event: "end", listener: () => void): void;
    on(event: "error", listener: (error: unknown) => void): void;
  };
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exit(code: number): never;
};

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

async function main(): Promise<void> {
  const input = await readStdin();
  const scenario = JSON.parse(input) as Scenario;
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
