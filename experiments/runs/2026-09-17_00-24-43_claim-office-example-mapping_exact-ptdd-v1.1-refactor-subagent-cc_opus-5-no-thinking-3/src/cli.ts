#!/usr/bin/env node
// The claim-office command: reads a scenario as JSON on stdin and writes the
// corresponding results as JSON on stdout. Transport only -- every decision
// belongs to the domain modules it calls.

import { ClaimOfficeRefusal } from "./claim-office-refusal.js";
import { type Scenario, runScenario } from "./scenario.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

const REFUSAL_EXIT_CODE = 1;

// A refused scenario produces no results: the office reports why on stderr
// and exits non-zero.
async function main(): Promise<void> {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  try {
    const results = runScenario(scenario);
    process.stdout.write(`${JSON.stringify({ results })}\n`);
  } catch (error) {
    if (!(error instanceof ClaimOfficeRefusal)) {
      throw error;
    }
    process.stderr.write(`${error.message}\n`);
    process.exitCode = REFUSAL_EXIT_CODE;
  }
}

await main();
