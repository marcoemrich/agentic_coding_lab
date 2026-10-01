import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

// Reading of the error contract: a rejected scenario exits non-zero, writes a
// non-empty error description to stderr and writes nothing to stdout.

const runCli = (scenario: object) =>
  spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });

const expectRejected = (result: ReturnType<typeof runCli>) => {
  expect(result.status).not.toBe(0);
  expect(result.stderr).not.toBe("");
  expect(result.stdout).toBe("");
};

const swordPolicyClaim = (damages: { itemType: string; amount: number }[]) => ({
  customer: { yearsWithMHPCO: 0 },
  steps: [
    { op: "quote", items: [{ type: "sword" }] },
    { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
  ],
});

describe("claim-office CLI", () => {
  it("schema example -> stdout {results:[{premium:59},{payout:100,remainingCap:1100}]}, exit 0", () => {
    const result = runCli({
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
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("quote with unknown item type -> non-zero exit, error on stderr, empty stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expectRejected(result);
  });
  it("claim damage for an item not in the policy -> non-zero exit, error on stderr", () => {
    expectRejected(runCli(swordPolicyClaim([{ itemType: "amulet", amount: 200 }])));
  });
  it("claim damage amount -200 -> non-zero exit, error on stderr", () => {
    expectRejected(runCli(swordPolicyClaim([{ itemType: "sword", amount: -200 }])));
  });
  it("two sword damages but one sword insured -> non-zero exit, error on stderr", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expectRejected(runCli(swordPolicyClaim(damages)));
  });
});
