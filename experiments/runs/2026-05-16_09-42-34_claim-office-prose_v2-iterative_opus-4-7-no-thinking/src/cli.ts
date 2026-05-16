import { runScenario } from "./engine.js";
import type { Scenario } from "./types.js";

// Minimal ambient declaration so we don't depend on @types/node in this kata.
declare const process: {
  stdin: {
    setEncoding: (encoding: string) => void;
    on: (event: string, listener: (arg: unknown) => void) => void;
  };
  stdout: { write: (s: string) => void };
  stderr: { write: (s: string) => void };
  exit: (code: number) => void;
};

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += String(chunk);
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", (err) => reject(err));
  });
}

async function main(): Promise<void> {
  const input = await readStdin();
  const scenario: Scenario = JSON.parse(input);
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result) + "\n");
}

main().catch((err) => {
  process.stderr.write(String(err) + "\n");
  process.exit(1);
});
