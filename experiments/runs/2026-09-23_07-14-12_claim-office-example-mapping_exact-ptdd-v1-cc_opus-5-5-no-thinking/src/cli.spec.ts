import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(scenario: unknown) {
  const run = spawnSync("npx", ["tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
  return { status: run.status, stdout: run.stdout, stderr: run.stderr };
}

function swordPolicyClaim(damages: { itemType: string; amount: number }[]) {
  return {
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  };
}

// Chosen error contract: the claim-office CLI exits with a non-zero status,
// writes an error description to stderr, and writes nothing to stdout.
describe("claim-office CLI", () => {
  it("schema example on stdin -> stdout {results:[{premium:59},{payout:100,remainingCap:1100}]}, exit 0", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("quote with unknown item type broomstick -> non-zero exit, error naming the type on stderr, no results on stdout", () => {
    const { status, stdout, stderr } = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toContain("broomstick");
  });
  it("claim damaging an amulet when only a sword is insured -> non-zero exit, error naming the item on stderr, no results on stdout", () => {
    const { status, stdout, stderr } = runCli(swordPolicyClaim([{ itemType: "amulet", amount: 300 }]));
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toContain("amulet");
  });
  it("claim damaging an item of unknown type -> non-zero exit, error naming the item on stderr, no results on stdout", () => {
    const { status, stdout, stderr } = runCli(swordPolicyClaim([{ itemType: "broomstick", amount: 300 }]));
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toContain("broomstick");
  });
  it("claim with two sword damages when only one sword is insured -> non-zero exit, whole claim rejected, no results on stdout", () => {
    const damage = { itemType: "sword", amount: 500 };
    const { status, stdout, stderr } = runCli(swordPolicyClaim([damage, damage]));
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toContain("sword");
  });
  it("claim with damage amount -200 -> non-zero exit, error naming the amount on stderr, no results on stdout", () => {
    const { status, stdout, stderr } = runCli(swordPolicyClaim([{ itemType: "sword", amount: -200 }]));
    expect(status).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toContain("-200");
  });
});
