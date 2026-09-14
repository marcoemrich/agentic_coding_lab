#!/usr/bin/env -S node --import tsx
import { processScenario } from "./claim-office.js";
import { parseScenario } from "./input.js";

async function main(): Promise<void> {
  try {
    const input = await readInput();
    const scenario = parseScenario(input);
    const output = processScenario(scenario);
    process.stdout.write(`${JSON.stringify(output)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exitCode = 1;
  }
}

function readInput(): Promise<string> {
  return new Promise((resolve, reject) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => { input += chunk; });
    process.stdin.on("end", () => { resolve(input); });
    process.stdin.on("error", reject);
  });
}

await main();
