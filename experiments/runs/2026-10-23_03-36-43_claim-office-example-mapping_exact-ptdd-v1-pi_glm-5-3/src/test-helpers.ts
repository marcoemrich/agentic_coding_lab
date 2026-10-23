import { spawn } from "node:child_process";

export interface ScenarioOutput {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  parsed: unknown;
}

/**
 * Sends the scenario JSON document to stdin of the claim-office CLI,
 * requires exit status 0 and an empty stderr, parses stdout as JSON
 * and returns it. The error contract tests need the raw exit status,
 * stderr, and stdout, so those tests use runScenarioRaw instead.
 */
export async function runScenario(scenario: unknown): Promise<unknown> {
  const raw = await runScenarioRaw(scenario);
  if (raw.exitCode !== 0 || raw.stderr !== "") {
    throw new Error(
      `CLI failed: exit ${raw.exitCode}, stderr: ${raw.stderr || "(empty)"}, stdout: ${raw.stdout}`,
    );
  }
  return raw.parsed;
}

/**
 * Runs the claim-office CLI with the scenario on stdin and returns
 * the raw exit status, stdout and stderr without asserting success.
 * JSON parse errors surface as parsed: null; error-contract tests only
 * assert the exit status, the stderr message, and that stdout carries
 * no results array.
 */
export function runScenarioRaw(scenario: unknown): Promise<ScenarioOutput> {
  return new Promise((resolve, reject) => {
    const child = spawn("node", ["node_modules/tsx/dist/cli.mjs", "src/cli.ts"], {
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (exitCode) => {
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(stdout);
      } catch {
        parsed = null;
      }
      resolve({ exitCode, stdout, stderr, parsed });
    });
    child.stdin.write(JSON.stringify(scenario));
    child.stdin.end();
  });
}
