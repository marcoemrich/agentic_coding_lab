#!/usr/bin/env node
import { processScenario } from "./claim-office.js";

async function main(): Promise<void> {
  try {
    let input = "";
    for await (const chunk of process.stdin) input += String(chunk);
    const result = processScenario(JSON.parse(input));
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exitCode = 1;
  }
}

void main();
