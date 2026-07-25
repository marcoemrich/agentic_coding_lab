#!/usr/bin/env tsx
import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

export function runCli(input: string): {
  stdout: string;
  stderr: string;
  exitCode: number;
} {
  try {
    const scenario = JSON.parse(input) as Scenario;
    const results = processScenario(scenario);
    return { stdout: JSON.stringify({ results }), stderr: "", exitCode: 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { stdout: "", stderr: message, exitCode: 1 };
  }
}

function main(): void {
  const input = readFileSync(0, "utf-8");
  const { stdout, stderr, exitCode } = runCli(input);
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
  process.exit(exitCode);
}

const isMainModule =
  typeof process.argv[1] === "string" && process.argv[1].endsWith("cli.ts");
if (isMainModule) {
  main();
}
