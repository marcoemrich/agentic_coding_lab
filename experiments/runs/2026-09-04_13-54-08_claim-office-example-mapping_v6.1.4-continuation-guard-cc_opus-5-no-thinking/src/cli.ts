#!/usr/bin/env node
import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const main = async (): Promise<void> => {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

try {
  await main();
} catch (error) {
  // Only the message: a stack trace would leak absolute paths and interpreter
  // internals at someone using this as a JSON-in/JSON-out tool.
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  // exitCode rather than exit(1), so buffered writes flush before exiting.
  process.exitCode = 1;
}
