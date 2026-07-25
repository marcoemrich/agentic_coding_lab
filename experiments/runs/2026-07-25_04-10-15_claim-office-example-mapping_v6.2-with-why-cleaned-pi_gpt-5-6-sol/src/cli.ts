#!/usr/bin/env -S node --import tsx

import { runScenario, type Scenario } from "./claim-office.js";

export const executeCli = (input: string): string =>
  JSON.stringify(runScenario(JSON.parse(input) as Scenario));

const readStandardInput = async (): Promise<string> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
};

if (process.argv[1]?.endsWith("cli.ts") || process.argv[1]?.endsWith("cli.js") || process.argv[1]?.endsWith("claim-office")) {
  readStandardInput()
    .then(input => process.stdout.write(executeCli(input)))
    .catch((error: unknown) => {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
      process.exitCode = 1;
    });
}

