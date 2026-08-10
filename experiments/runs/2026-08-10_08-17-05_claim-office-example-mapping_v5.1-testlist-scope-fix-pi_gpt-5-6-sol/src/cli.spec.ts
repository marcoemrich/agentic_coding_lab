import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";

const runCli = (input: unknown) => spawnSync(
  process.execPath,
  ["--import", "tsx", "src/cli.ts"],
  { input: JSON.stringify(input), encoding: "utf8" },
);

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes results JSON to stdout", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 5 }] });
  });

  it("exits non-zero, describes invalid input on stderr, and writes no results to stdout", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/Unknown item type/);
    expect(run.stdout).toBe("");
  });
});
