import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

const runCli = (input: string) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input,
    encoding: "utf8",
  });

const SCHEMA_EXAMPLE = JSON.stringify({
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
      incident: {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 200 }],
      },
    },
  ],
});

describe("claim-office CLI", () => {
  it("writes the results JSON to stdout for a valid scenario", () => {
    const result = runCli(SCHEMA_EXAMPLE);

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("exits non-zero with an error on stderr and no results on stdout when the scenario is rejected", () => {
    const result = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    );

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown item type/i);
    expect(result.stdout).toBe("");
  });
});
