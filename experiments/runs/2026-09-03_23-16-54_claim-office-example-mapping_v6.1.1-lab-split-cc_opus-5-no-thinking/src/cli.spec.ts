import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";

interface CliRun {
  stdout: string;
  stderr: string;
  code: number;
}

/**
 * Runs the CLI as a real subprocess. Exit codes and the separation of stdout
 * from stderr are the contract the spec states, and neither survives being
 * tested through a function call.
 */
const runCli = (input: string): Promise<CliRun> =>
  new Promise((resolve) => {
    const child = execFile("npx", ["tsx", "src/cli.ts"], (error, stdout, stderr) => {
      resolve({ stdout, stderr, code: error && "code" in error ? Number(error.code) : 0 });
    });

    child.stdin?.end(input);
  });

describe("claim-office CLI", () => {
  it("writes the results JSON to stdout for a valid scenario", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };

    const { stdout, code } = await runCli(JSON.stringify(scenario));

    // 60 base − 12 loyalty + 6 first insurance + 5 fee = 59.
    // Damage 200 − 100 deductible = 100; cap 1200 leaves 1100.
    expect(code).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits non-zero and writes to stderr for an unknown item type", async () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const { stderr, code } = await runCli(JSON.stringify(scenario));

    expect(code).not.toBe(0);
    expect(stderr).toContain("broomstick");
    // A description of what went wrong, not an uncaught exception's stack frames.
    expect(stderr).not.toMatch(/\n\s+at /);
  });
  it("writes nothing to stdout when the scenario is rejected", async () => {
    // The first step is a perfectly good quote; only the second is rejected.
    // So there are results already computed that a careless CLI could leak.
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    };

    const { stdout, stderr, code } = await runCli(JSON.stringify(scenario));

    expect(stdout).toBe("");
    expect(code).not.toBe(0);
    expect(stderr).toContain("amulet");
  });
});
