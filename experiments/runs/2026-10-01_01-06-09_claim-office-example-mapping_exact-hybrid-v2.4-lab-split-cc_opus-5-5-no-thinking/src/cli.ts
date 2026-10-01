#!/usr/bin/env -S npx tsx
import { processScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: string[] = [];
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) chunks.push(chunk);
  return chunks.join("");
};

const errorMessageOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// Results are only written once the whole scenario succeeded, so a failure leaves stdout empty.
try {
  const scenario = JSON.parse(await readStdin());
  process.stdout.write(JSON.stringify(processScenario(scenario)) + "\n");
} catch (error) {
  process.stderr.write(`Error: ${errorMessageOf(error)}\n`);
  process.exitCode = 1;
}
