import { readFileSync } from "node:fs";
import type { ScenarioInput } from "./types.js";
import { processScenario } from "./scenario.js";

export interface CliRunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export function runCli(stdin: string): CliRunResult {
  let parsed: ScenarioInput;
  try {
    parsed = JSON.parse(stdin) as ScenarioInput;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { stdout: "", stderr: `Invalid JSON: ${message}`, exitCode: 1 };
  }

  try {
    const output = processScenario(parsed);
    return { stdout: JSON.stringify(output), stderr: "", exitCode: 0 };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { stdout: "", stderr: message, exitCode: 1 };
  }
}

function main(): void {
  const stdin = readFileSync(0, "utf-8");
  const { stdout, stderr, exitCode } = runCli(stdin);
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
  process.exit(exitCode);
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main();
}
