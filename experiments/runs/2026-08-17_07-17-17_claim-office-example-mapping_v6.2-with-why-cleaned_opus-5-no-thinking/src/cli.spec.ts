import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

// The CLI is exercised as a real subprocess rather than by importing it: exit
// codes and the stdout/stderr split are the contract, and only a process has
// those. This is why these tests live apart from claim-office.spec.ts.
const runCli = (stdin: string) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], { input: stdin, encoding: "utf8" });

describe("claim-office CLI", () => {
  it("writes {results: [...]} to stdout for a scenario read from stdin", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };

    const cli = runCli(JSON.stringify(scenario));

    expect(cli.status).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [
        // 60 G base − 12 G loyalty + 6 G first insurance + 5 G fee
        { premium: 59 },
        // 200 G − 100 G deductible; cap 1200 G − 100 G
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });

  it("exits with a non-zero status and writes to stderr when the scenario is invalid", () => {
    const cli = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    );

    expect(cli.status).not.toBe(0);
    expect(cli.stdout).toBe("");
    // The clerk explains the refusal; they do not hand over a stack trace.
    expect(cli.stderr).toMatch(/broomstick/);
    expect(cli.stderr).not.toMatch(/^\s+at /m);
  });
});
