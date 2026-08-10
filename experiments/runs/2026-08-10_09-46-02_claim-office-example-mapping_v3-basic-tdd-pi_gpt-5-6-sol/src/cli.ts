#!/usr/bin/env -S node --import tsx
import { processScenario, type Scenario } from "./claim-office.js";

async function main(): Promise<void> {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input) as Scenario;
    process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exitCode = 1;
  }
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", chunk => { input += chunk; });
    process.stdin.on("end", () => resolve(input));
    process.stdin.on("error", reject);
  });
}

await main();
