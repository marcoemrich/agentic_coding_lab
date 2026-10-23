// claim-office CLI adapter: reads a scenario JSON from stdin, writes a results
// JSON to stdout, and uses the computed status as the process exit code.
import { processScenario } from "./claimOffice.js";
import type { Scenario } from "./claimOffice.js";
import { fileURLToPath } from "node:url";

export interface CliResult {
  code: number;
  stdout: string;
  stderr: string;
}

const EXIT_OK = 0;
const EXIT_ERROR = 1;

export function runCli(input: string): CliResult {
  try {
    const scenario = JSON.parse(input) as Scenario;
    const { results } = processScenario(scenario);
    return { code: EXIT_OK, stdout: `${JSON.stringify({ results })}\n`, stderr: "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { code: EXIT_ERROR, stdout: "", stderr: `${message}\n` };
  }
}

// Executable entry point: read the scenario from stdin, write the result to
// stdout/stderr, and exit with the computed status code.
function main(): void {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    input += chunk;
  });
  process.stdin.on("end", () => {
    const { code, stdout, stderr } = runCli(input);
    if (stdout !== "") {
      process.stdout.write(stdout);
    }
    if (stderr !== "") {
      process.stderr.write(stderr);
    }
    process.exit(code);
  });
}

// Run main only when executed directly (e.g. `tsx src/cli.ts`), not when
// imported by the test suite.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
