#!/usr/bin/env tsx
import { processScenario, type Scenario } from "./claim-office.js";

declare const process: {
  stdin: AsyncIterable<string> & { setEncoding(encoding: string): void };
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exit(code: number): never;
  argv: string[];
};

const EXIT_SUCCESS = 0;
const EXIT_ERROR = 1;

export function runCli(
  input: string,
  writeStdout: (text: string) => void,
  writeStderr: (text: string) => void
): number {
  try {
    const scenario = JSON.parse(input) as Scenario;
    const output = processScenario(scenario);
    writeStdout(`${JSON.stringify(output)}\n`);
    return EXIT_SUCCESS;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeStderr(`${message}\n`);
    return EXIT_ERROR;
  }
}

async function main(): Promise<void> {
  process.stdin.setEncoding("utf8");
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  const code = runCli(
    input,
    (text) => process.stdout.write(text),
    (text) => process.stderr.write(text)
  );
  process.exit(code);
}

const entryArg = process.argv[1] ?? "";
if (
  entryArg.endsWith("cli.ts") ||
  entryArg.endsWith("cli.js") ||
  entryArg.endsWith("claim-office")
) {
  void main();
}
