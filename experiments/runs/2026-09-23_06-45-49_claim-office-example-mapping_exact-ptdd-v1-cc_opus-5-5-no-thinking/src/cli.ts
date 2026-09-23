#!/usr/bin/env -S npx tsx
import { processScenario, type Scenario } from "./claimOffice.js";

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    process.stdin.on("data", (chunk: Buffer) => chunks.push(chunk));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    process.stdin.on("error", reject);
  });
}

try {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
} catch (error) {
  process.stderr.write(`claim-office: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
