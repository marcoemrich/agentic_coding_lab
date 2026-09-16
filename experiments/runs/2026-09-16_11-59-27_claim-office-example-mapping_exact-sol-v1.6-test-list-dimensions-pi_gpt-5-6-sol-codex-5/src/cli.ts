#!/usr/bin/env -S pnpm exec tsx
import { executeScenario, type Scenario } from "./claim-office.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

try {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(JSON.stringify(executeScenario(scenario)));
} catch (error) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
}
