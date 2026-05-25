#!/usr/bin/env node
import { runScenario } from "./scenario.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  try {
    const raw = await readStdin();
    const input = JSON.parse(raw);
    const output = runScenario(input);
    process.stdout.write(JSON.stringify(output) + "\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exit(1);
  }
}

main();
