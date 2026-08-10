#!/usr/bin/env -S node --import tsx
import { parseScenario, runScenario } from "./claim-office";

async function main(): Promise<void> {
  try {
    let input = "";
    process.stdin.setEncoding("utf8");
    for await (const chunk of process.stdin) input += chunk;
    const scenario = parseScenario(JSON.parse(input));
    process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exitCode = 1;
  }
}

void main();
