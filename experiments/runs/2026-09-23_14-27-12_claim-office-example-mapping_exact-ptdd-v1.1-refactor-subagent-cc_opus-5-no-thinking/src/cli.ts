#!/usr/bin/env -S npx tsx
import { type Scenario, runScenario } from "./scenario.js";

const REJECTED_EXIT_CODE = 1;

async function readStdin(): Promise<string> {
  const chunks: string[] = [];
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    chunks.push(chunk as string);
  }
  return chunks.join("");
}

function describeRejection(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}

/**
 * The counter clerk: it takes a scenario in at the window, hands it to the office,
 * and writes back either the results or the reason the office refused it.
 */
async function main(): Promise<void> {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
}

main().catch((reason: unknown) => {
  process.stderr.write(`${describeRejection(reason)}\n`);
  process.exitCode = REJECTED_EXIT_CODE;
});
