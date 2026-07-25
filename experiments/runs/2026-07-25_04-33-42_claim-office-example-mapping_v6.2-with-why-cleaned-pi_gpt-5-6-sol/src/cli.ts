#!/usr/bin/env -S node --import tsx
import { processScenario, type Scenario } from "./claim-office.js";

declare const process: {
  stdin: AsyncIterable<unknown>;
  stdout: { write(value: string): void };
  stderr: { write(value: string): void };
  exitCode?: number;
};

const readStdin = async (): Promise<string> => {
  let input = "";
  for await (const chunk of process.stdin) input += String(chunk);
  return input;
};

try {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
