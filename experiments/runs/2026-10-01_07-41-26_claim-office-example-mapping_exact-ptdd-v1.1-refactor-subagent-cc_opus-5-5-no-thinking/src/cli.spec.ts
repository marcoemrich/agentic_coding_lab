import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function claimAgainstSwordPolicy(damages: { itemType: string; amount: number }[]) {
  return runCli({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
}

function runCli(scenario: unknown) {
  return spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
}

// A rejected scenario fails as a whole: non-zero exit, an error naming the culprit, no results.
function expectRejectedNaming(run: ReturnType<typeof runCli>, culprit: string) {
  expect(run.status).not.toBe(0);
  expect(run.stderr).toContain(culprit);
  expect(run.stdout).not.toContain("results");
}

describe("claim-office CLI", () => {
  it("reads the scenario JSON from stdin and writes {results} JSON to stdout with exit code 0", () => {
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

  it("quote with unknown item type (broomstick) -> non-zero exit, error on stderr naming the type, no results on stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expectRejectedNaming(run, "broomstick");
  });
  it("claim damaging an amulet when only a sword is insured -> non-zero exit, error on stderr naming the item", () => {
    expectRejectedNaming(claimAgainstSwordPolicy([{ itemType: "amulet", amount: 300 }]), "amulet");
  });
  it("claim damaging an item of unknown type -> non-zero exit, error on stderr naming the type", () => {
    expectRejectedNaming(claimAgainstSwordPolicy([{ itemType: "broomstick", amount: 300 }]), "broomstick");
  });
  it("claim with damage amount -200 -> non-zero exit, error on stderr naming the amount", () => {
    expectRejectedNaming(claimAgainstSwordPolicy([{ itemType: "sword", amount: -200 }]), "-200");
  });
  it("claim with two sword damages but only one sword insured -> non-zero exit, whole claim rejected", () => {
    expectRejectedNaming(
      claimAgainstSwordPolicy([
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ]),
      "sword",
    );
  });
});
