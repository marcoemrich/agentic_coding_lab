import { describe, it, expect } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";

const runCli = (scenario: unknown): string =>
  execFileSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });

describe("claim-office CLI", () => {
  it("reads a JSON scenario from stdin and writes the results JSON to stdout", () => {
    const stdout = runCli({
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
    });

    // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59; cap 2 x 600 = 1200
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("on an invalid scenario exits with a non-zero status code, writes to stderr, and writes no results to stdout", () => {
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
      encoding: "utf8",
    });

    expect(result.status).not.toBe(0);
    expect(result.status).not.toBeNull();
    expect(result.stdout).not.toContain("results");

    // a description of the problem, not a stack trace
    expect(result.stderr).toContain("the MHPCO price list does not cover a broomstick");
    expect(result.stderr).not.toContain("    at ");
  });
});
