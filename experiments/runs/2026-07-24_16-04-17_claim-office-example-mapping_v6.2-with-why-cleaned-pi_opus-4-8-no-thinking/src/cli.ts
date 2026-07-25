#!/usr/bin/env node
import { runScenario, type Scenario } from "./claim-office.js";

declare const process: {
  stdin: {
    setEncoding(encoding: string): void;
    on(event: string, listener: (arg: string) => void): void;
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
    const output = runScenario(scenario);
    process.stdout.write(JSON.stringify(output));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office error: ${message}\n`);
    process.exit(1);
  }
};

void main();
