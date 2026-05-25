import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const CLI_PATH = resolve(__dirname, "cli.ts");

function runCli(input: string): { status: number; stdout: string; stderr: string } {
  const result = spawnSync("npx", ["tsx", CLI_PATH], {
    input,
    encoding: "utf8",
  });
  return {
    status: result.status ?? -1,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe("claim-office CLI", () => {
  it("reads JSON from stdin, writes JSON results to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    const { status, stdout } = runCli(input);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 5 }] });
  });

  it("exits non-zero and writes to stderr for unknown item type, no results to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const { status, stdout, stderr } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).toBe("");
  });
});
