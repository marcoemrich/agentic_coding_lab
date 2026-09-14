#!/usr/bin/env -S node --import tsx
import { processScenario, type Scenario } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk: string) => { input += chunk; });
process.stdin.on("end", () => {
  try {
    const output = processScenario(JSON.parse(input) as Scenario);
    process.stdout.write(JSON.stringify(output));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
});
