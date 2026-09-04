#!/usr/bin/env node
import { runScenario, type Scenario } from "./claim-office.js";

export interface CliResult {
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number;
}

const SUCCESS_EXIT_CODE = 0;
const FAILURE_EXIT_CODE = 1;

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);

  return Buffer.concat(chunks).toString("utf8");
};

export const main = async (): Promise<void> => {
  const { stdout, stderr, exitCode } = run(await readStdin());

  if (stdout) process.stdout.write(`${stdout}\n`);
  if (stderr) process.stderr.write(`${stderr}\n`);
  process.exitCode = exitCode;
};

export const run = (input: string): CliResult => {
  try {
    const scenario = JSON.parse(input) as Scenario;
    const results = runScenario(scenario);

    return { stdout: JSON.stringify(results), stderr: "", exitCode: SUCCESS_EXIT_CODE };
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
      exitCode: FAILURE_EXIT_CODE,
    };
  }
};

// Only run as a program, not when imported by tests.
if (process.argv[1]?.endsWith("cli.ts") || process.argv[1]?.endsWith("cli.js")) {
  void main();
}
