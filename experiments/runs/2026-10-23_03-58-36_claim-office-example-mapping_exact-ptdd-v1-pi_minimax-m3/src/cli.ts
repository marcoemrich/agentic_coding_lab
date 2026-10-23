#!/usr/bin/env node
// CLI entry point: reads a scenario JSON from stdin, runs it, writes the
// results JSON to stdout. On error, writes an error description to stderr
// and exits with a non-zero status code.

import { runScenario } from "./scenario.js";
import { DomainError } from "./domain.js";
import type { Scenario } from "./domain.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function parseScenario(input: string): Scenario {
  return JSON.parse(input) as Scenario;
}

function reportError(err: unknown): void {
  const message =
    err instanceof DomainError || err instanceof Error
      ? err.message
      : String(err);
  process.stderr.write(message + "\n");
  process.exit(1);
}

async function main(): Promise<void> {
  try {
    const input = await readStdin();
    const scenario = parseScenario(input);
    const results = runScenario(scenario);
    process.stdout.write(JSON.stringify(results) + "\n");
  } catch (err) {
    reportError(err);
  }
}

main();
