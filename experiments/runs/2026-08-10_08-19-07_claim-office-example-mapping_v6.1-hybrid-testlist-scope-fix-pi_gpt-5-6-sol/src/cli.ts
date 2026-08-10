#!/usr/bin/env node
import { processScenario } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk: string) => { input += chunk; });
process.stdin.on("end", () => {
  try {
    const scenario: unknown = JSON.parse(input);
    process.stdout.write(`${JSON.stringify(processScenario(scenario as never))}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
});
