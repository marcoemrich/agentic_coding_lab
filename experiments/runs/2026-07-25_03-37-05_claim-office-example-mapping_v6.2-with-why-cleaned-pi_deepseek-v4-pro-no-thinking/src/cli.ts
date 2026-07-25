#!/usr/bin/env node
// MHPCO Claim Office CLI entry point
// Reads JSON from stdin, writes JSON results to stdout

import { processScenario } from "./claim-office.js";

async function main(): Promise<void> {
  // Read all of stdin
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const input = Buffer.concat(chunks).toString("utf-8");

  let parsed: any;
  try {
    parsed = JSON.parse(input);
  } catch {
    process.stderr.write("Error: Invalid JSON input\n");
    process.exit(1);
  }

  try {
    const result = processScenario(parsed);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (error: any) {
    process.stderr.write(error.message + "\n");
    process.exit(1);
  }
}

main();