#!/usr/bin/env node
import { runScenario, type Scenario } from "./scenario.js";

async function readStdin(): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  const input = await readStdin();

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch (error) {
    throw new Error(`input is not valid JSON: ${(error as Error).message}`);
  }

  process.stdout.write(JSON.stringify(runScenario(scenario)) + "\n");
}

main().catch((error: Error) => {
  process.stderr.write(`claim-office: ${error.message}\n`);
  process.exitCode = 1;
});
