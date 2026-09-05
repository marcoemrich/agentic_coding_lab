import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

const runCli = (input: string) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes the results to stdout", () => {
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
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits non-zero and writes to stderr when an item type is unknown", () => {
    const cli = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    );

    expect(cli.status).not.toBe(0);
    // an error description, not a stack trace
    expect(cli.stderr.trim()).toBe("unknown item type: broomstick");
  });
  it("writes no results to stdout when a later step is rejected", () => {
    const cli = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "broomstick" }] },
        ],
      }),
    );

    expect(cli.status).not.toBe(0);
    expect(cli.stdout).toBe("");
  });
});
