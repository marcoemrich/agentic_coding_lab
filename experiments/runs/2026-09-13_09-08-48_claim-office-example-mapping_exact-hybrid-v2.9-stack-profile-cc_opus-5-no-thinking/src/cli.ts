#!/usr/bin/env node
import { runScenario } from "./claim-office.js";

// The project has no @types/node, so the two Node globals this entry point
// uses are declared with just the surface it needs.
declare const process: {
  stdin: AsyncIterable<{ toString(encoding: string): string }>;
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exitCode: number;
};

const readStdin = async (): Promise<string> => {
  let input = "";

  for await (const chunk of process.stdin) {
    input += chunk.toString("utf8");
  }

  return input;
};

// The office rejects a malformed dossier outright: nothing is written to
// stdout, the complaint goes to stderr, and the exit code marks the failure.
const main = async (): Promise<void> => {
  try {
    const scenario: unknown = JSON.parse(await readStdin());

    process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
};

await main();
