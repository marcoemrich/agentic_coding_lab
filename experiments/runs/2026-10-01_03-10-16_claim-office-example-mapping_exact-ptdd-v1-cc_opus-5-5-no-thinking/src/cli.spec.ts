import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const runCli = (scenario: unknown) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });

const schemaExample = {
  customer: { yearsWithMHPCO: 5 },
  steps: [
    { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
    { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
  ],
};

const withSword = (damages: unknown[]) => ({
  customer: { yearsWithMHPCO: 0 },
  steps: [
    { op: "quote", items: [{ type: "sword" }] },
    { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
  ],
});

const expectRejected = (scenario: unknown, problem: RegExp) => {
  const result = runCli(scenario);
  expect(result.status).not.toBe(0);
  expect(result.stderr).toMatch(problem);
  expect(result.stdout).not.toContain("results");
};

describe("claim-office CLI", () => {
  it("schema example via stdin -> stdout {results:[{premium:59},{payout:100,remainingCap:1100}]}, exit 0", () => {
    const result = runCli(schemaExample);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("unknown item type -> non-zero exit, error on stderr, no results on stdout", () => {
    expectRejected({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] }, /broomstick/);
  });
  it("damage to item not in policy -> non-zero exit, error on stderr", () => {
    expectRejected(withSword([{ itemType: "amulet", amount: 200 }]), /amulet/);
  });
  it("more damages of a type than insured -> non-zero exit, error on stderr", () => {
    expectRejected(withSword([{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]), /sword/);
  });
  it("negative damage amount -> non-zero exit, error on stderr", () => {
    expectRejected(withSword([{ itemType: "sword", amount: -200 }]), /-200/);
  });
});
