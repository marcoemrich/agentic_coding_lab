#!/usr/bin/env -S node --import tsx
import { processScenario, type Scenario } from "./claim-office.js";

const chunks: Buffer[] = [];
for await (const chunk of process.stdin) {
  chunks.push(Buffer.from(chunk));
}

try {
  const scenario = JSON.parse(Buffer.concat(chunks).toString("utf8")) as Scenario;
  process.stdout.write(JSON.stringify(processScenario(scenario)));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
