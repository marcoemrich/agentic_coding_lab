#!/usr/bin/env node
import { runScenario, type Scenario } from "./claim-office.js";

const EXIT_FAILURE = 1;

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (input += chunk));
    process.stdin.on("end", () => resolve(input));
    process.stdin.on("error", reject);
  });
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function main(): Promise<void> {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  const results = runScenario(scenario);
  process.stdout.write(`${JSON.stringify({ results })}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${describe(error)}\n`);
  process.exitCode = EXIT_FAILURE;
});
