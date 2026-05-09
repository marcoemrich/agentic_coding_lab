#!/usr/bin/env node
import { runScenario } from "./scenario.js";
import type { Scenario } from "./types.js";

interface NodeProcess {
  stdin: {
    setEncoding(enc: string): void;
    on(event: "data", cb: (chunk: string) => void): void;
    on(event: "end", cb: () => void): void;
    on(event: "error", cb: (err: Error) => void): void;
  };
  stdout: { write(s: string): void };
  exit(code: number): void;
}
declare const process: NodeProcess;
declare const console: { error(...args: unknown[]): void };

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => {
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
  process.stdout.write(JSON.stringify(result) + "\n");
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
