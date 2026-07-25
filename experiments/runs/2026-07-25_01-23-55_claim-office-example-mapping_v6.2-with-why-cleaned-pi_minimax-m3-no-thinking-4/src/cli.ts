#!/usr/bin/env node
// CLI entry point for the MHPCO Claim Office scenario processor.
// Reads a JSON scenario from stdin, processes it with runScenario(),
// and writes the JSON result to stdout. On any error, writes the
// message to stderr and exits with a non-zero status code.

import { runScenario, type Scenario } from "./scenario.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input) as Scenario;
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: ${message}\n`);
    process.exit(1);
  }
}

void main();
