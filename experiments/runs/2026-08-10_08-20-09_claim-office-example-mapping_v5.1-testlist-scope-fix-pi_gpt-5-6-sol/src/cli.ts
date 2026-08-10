#!/usr/bin/env node
import { runScenario, type Scenario } from "./claim-office.js";

async function main(): Promise<void> {
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
    const scenario = JSON.parse(Buffer.concat(chunks).toString("utf8")) as Scenario;
    process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

void main();
