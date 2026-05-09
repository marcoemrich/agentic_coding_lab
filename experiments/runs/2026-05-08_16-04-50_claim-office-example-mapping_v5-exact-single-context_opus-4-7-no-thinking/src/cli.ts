#!/usr/bin/env node
import { runScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  let scenario: unknown;
  try {
    scenario = JSON.parse(input);
  } catch (e) {
    process.stderr.write(`Invalid JSON input: ${(e as Error).message}\n`);
    process.exit(1);
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = runScenario(scenario as any);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (e) {
    process.stderr.write(`Error: ${(e as Error).message}\n`);
    process.exit(1);
  }
};

main();
