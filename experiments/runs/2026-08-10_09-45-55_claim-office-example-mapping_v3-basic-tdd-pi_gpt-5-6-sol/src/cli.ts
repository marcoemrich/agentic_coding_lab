#!/usr/bin/env -S node --import tsx
import { processScenario, type Scenario } from "./claim-office.js";

declare const process: {
  stdin: { setEncoding(encoding: string): void; on(event: string, callback: (chunk?: string) => void): void };
  stdout: { write(value: string): void };
  stderr: { write(value: string): void };
  exitCode: number;
};

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk = "") => { input += chunk; });
process.stdin.on("end", () => {
  try {
    const scenario = JSON.parse(input) as Scenario;
    process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exitCode = 1;
  }
});
