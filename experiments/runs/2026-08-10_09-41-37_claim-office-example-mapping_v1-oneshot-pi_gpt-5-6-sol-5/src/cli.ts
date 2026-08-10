#!/usr/bin/env node
import { InputError, runScenario } from "./claim-office.js";

async function main(): Promise<void> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  const text = Buffer.concat(chunks).toString("utf8");
  const output = runScenario(JSON.parse(text) as unknown);
  process.stdout.write(`${JSON.stringify(output)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  const prefix = error instanceof InputError || error instanceof SyntaxError ? "Invalid input" : "Error";
  process.stderr.write(`${prefix}: ${message}\n`);
  process.exitCode = 1;
});
