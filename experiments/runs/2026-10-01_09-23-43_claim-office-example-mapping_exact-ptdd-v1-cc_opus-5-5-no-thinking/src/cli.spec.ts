import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(scenario: unknown) {
  return spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
}

function claimScenario(damages: { itemType: string; amount: number }[]) {
  return {
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  };
}

function expectRejected(result: ReturnType<typeof runCli>) {
  expect(result.status).not.toBe(0);
  expect(result.stderr).not.toBe("");
  expect(result.stdout).not.toContain("results");
}

describe("claim-office CLI (src/cli.ts)", () => {
  it("schema example via stdin -> stdout {results:[{premium:59},{payout:100,remainingCap:1100}]}, exit 0", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect({ status: result.status, stdout: JSON.parse(result.stdout || "null") }).toEqual({
      status: 0,
      stdout: { results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] },
    });
  });
  it("quote with unknown item type -> non-zero exit, error on stderr, no results on stdout", () => {
    expectRejected(runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] }));
  });
  it("claim damaging an item not in the policy -> non-zero exit, error on stderr, no results on stdout", () => {
    expectRejected(runCli(claimScenario([{ itemType: "amulet", amount: 300 }])));
  });
  it("claim with more sword damages than insured swords -> non-zero exit, error on stderr, no results on stdout", () => {
    expectRejected(
      runCli(
        claimScenario([
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]),
      ),
    );
  });
  it("claim with amount -200 -> non-zero exit, error on stderr, no results on stdout", () => {
    expectRejected(runCli(claimScenario([{ itemType: "sword", amount: -200 }])));
  });
});
