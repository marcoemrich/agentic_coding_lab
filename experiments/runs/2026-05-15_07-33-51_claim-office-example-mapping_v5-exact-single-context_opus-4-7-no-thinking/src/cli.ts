#!/usr/bin/env node
import { runScenario, Scenario } from "./claim-office.js";

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
    const output = runScenario(scenario);
    process.stdout.write(JSON.stringify(output));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    process.stderr.write(msg + "\n");
    process.exit(1);
  }
}

main();
