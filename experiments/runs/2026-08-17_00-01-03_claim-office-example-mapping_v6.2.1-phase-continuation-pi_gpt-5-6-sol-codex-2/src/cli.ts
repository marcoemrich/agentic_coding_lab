#!/usr/bin/env node
import { executeScenario, type Scenario } from "./claim-office.js";

declare const process: {
  stdin: AsyncIterable<unknown>;
  stdout: { write(value: string): void };
  stderr: { write(value: string): void };
  exitCode: number;
};

async function main(): Promise<void> {
  try {
    let input = "";
    for await (const chunk of process.stdin) input += String(chunk);
    const scenario = JSON.parse(input) as Scenario;
    process.stdout.write(`${JSON.stringify(executeScenario(scenario))}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

await main();
