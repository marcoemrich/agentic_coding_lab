// claim-office CLI: reads a scenario JSON from stdin, writes results JSON to stdout.
// Invalid input rejects the whole scenario: a message on stderr, no results, non-zero exit status.
import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const STDIN_FD = 0;

const readStdin = (): string => readFileSync(STDIN_FD, "utf8");

const writeJson = (value: unknown): void => {
  process.stdout.write(JSON.stringify(value) + "\n");
};

try {
  writeJson(runScenario(JSON.parse(readStdin())));
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
