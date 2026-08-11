import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";

interface CliRun {
  stdout: string;
  stderr: string;
  code: number;
}

const runCli = (input: string): Promise<CliRun> =>
  new Promise((resolve, reject) => {
    const child = spawn("node_modules/.bin/tsx", ["src/cli.ts"]);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (code) => resolve({ stdout, stderr, code: code ?? 0 }));
    child.stdin.end(input);
  });

// A clean rejection is one fact spelled four ways: nothing on stdout, a
// non-zero code, and a stderr that explains the cause without a stack trace.
// Naming it keeps the four from reading as four unrelated claims.
const expectCleanRejection = (run: CliRun, cause: string): void => {
  expect(run.code).not.toBe(0);
  expect(run.stdout).toBe("");
  expect(run.stderr).toContain(cause);
  expect(run.stderr).not.toContain("at ");
};

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes {results:[...]} to stdout", async () => {
    const { stdout, code } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
            ],
          },
        ],
      }),
    );

    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }] });
  });
  it("writes a premium result for a quote step and a payout/remainingCap result for a claim step", async () => {
    const { stdout, code } = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
    );

    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("exits with a non-zero status code and writes an error to stderr for an unknown item type, writing no results to stdout", async () => {
    const run = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    );

    expectCleanRejection(run, "broomstick");
  });
  it("exits with a non-zero status code and writes an error to stderr for a damage to an item not in the policy", async () => {
    const run = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      }),
    );

    expectCleanRejection(run, "amulet");
  });
  it("exits with a non-zero status code and writes an error to stderr for a negative damage amount", async () => {
    const run = await runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    );

    expectCleanRejection(run, "-200");
  });
});
