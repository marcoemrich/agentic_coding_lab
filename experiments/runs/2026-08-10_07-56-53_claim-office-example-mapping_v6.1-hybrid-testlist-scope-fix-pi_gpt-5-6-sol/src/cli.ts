#!/usr/bin/env -S node --import tsx
import { runScenario, type Scenario } from "./claim-office.js";

const readStandardInput = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
};

try {
  const input = await readStandardInput();
  const scenario = JSON.parse(input) as Scenario;
  const output = runScenario(scenario);
  process.stdout.write(`${JSON.stringify(output)}\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`claim-office: ${message}\n`);
  process.exitCode = 1;
}
