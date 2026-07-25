import { runScenario, type Scenario } from "./claim-office.js";

// Minimal ambient declaration for the Node.js process global,
// since @types/node is not a project dependency.
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
    process.stdin.on("data", (chunk: string) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = JSON.parse(input) as Scenario;
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result) + "\n");
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
