#!/usr/bin/env tsx
import { runScenario, type Scenario } from "./claim-office.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

try {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  // The whole scenario is rejected: nothing is written to stdout.
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
  process.exit(1);
}
