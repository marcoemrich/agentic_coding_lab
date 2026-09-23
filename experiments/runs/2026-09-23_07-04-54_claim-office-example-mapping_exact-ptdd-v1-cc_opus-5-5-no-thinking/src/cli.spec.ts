import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(input: unknown): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function expectRejection(output: { status: number | null; stdout: string; stderr: string }, description: string): void {
  expect(output.status).not.toBe(0);
  expect(output.stderr).toContain(description);
  expect(output.stdout).not.toContain("results");
}

function claimAgainstOneSword(damages: { itemType: string; amount: number }[]): unknown {
  return {
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  };
}

// Rejections are observed as: non-zero exit status, a non-empty error
// description on stderr, and no `results` on stdout.
describe("claim-office CLI", () => {
  it("schema example (5-year customer, silver amulet quote + fire claim 200) -> results [{premium: 59}, {payout: 100, remainingCap: 1100}]", () => {
    const output = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(JSON.parse(output.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("quote with unknown item type broomstick -> non-zero exit, stderr, no results", () => {
    const output = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expectRejection(output, "broomstick");
  });
  it("claim damaging an amulet when only a sword is insured -> non-zero exit, stderr", () => {
    expectRejection(runCli(claimAgainstOneSword([{ itemType: "amulet", amount: 200 }])), "amulet");
  });
  it("claim damaging an item of unknown type -> non-zero exit, stderr", () => {
    expectRejection(runCli(claimAgainstOneSword([{ itemType: "broomstick", amount: 200 }])), "broomstick");
  });
  it("claim with damage amount -200 -> non-zero exit, stderr", () => {
    expectRejection(runCli(claimAgainstOneSword([{ itemType: "sword", amount: -200 }])), "-200");
  });
  it("claim with two sword damages but one sword insured -> non-zero exit, whole claim rejected", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expectRejection(runCli(claimAgainstOneSword(damages)), "sword");
  });
});
