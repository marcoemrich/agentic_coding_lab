#!/usr/bin/env tsx
/** claim-office CLI adapter: JSON scenario on stdin, results on stdout. */

import { runScenario } from "./scenario.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

try {
  const input = JSON.parse(await readStdin());
  const output = runScenario(input);
  process.stdout.write(`${JSON.stringify(output)}\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`claim-office: ${message}\n`);
  process.exit(1);
}
