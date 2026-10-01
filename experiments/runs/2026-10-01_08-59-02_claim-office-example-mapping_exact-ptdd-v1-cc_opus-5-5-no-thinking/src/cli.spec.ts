import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(scenario: unknown) {
  const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function expectRejected(result: ReturnType<typeof runCli>) {
  expect(result.status).not.toBe(0);
  expect(result.stderr).not.toBe("");
  expect(result.stdout).toBe("");
}

const swordPolicy = { op: "quote", items: [{ type: "sword" }] };
const claimOf = (damages: { itemType: string; amount: number }[]) => ({
  op: "claim",
  policy: 0,
  incident: { cause: "dragon attack", damages },
});

describe("claim-office CLI", () => {
  it("schema example (5-year customer, silver amulet ench 2, fire damage 200) -> {results: [{premium: 59}, {payout: 100, remainingCap: 1100}]}", () => {
    const { status, stdout } = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(status).toBe(0);
  });
  it("quote with unknown item type 'broomstick' -> non-zero exit, error on stderr, nothing on stdout", () => {
    expectRejected(runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] }));
  });
  it("claim damaging an amulet when only a sword is insured -> non-zero exit, error on stderr, nothing on stdout", () => {
    const steps = [swordPolicy, claimOf([{ itemType: "amulet", amount: 300 }])];
    expectRejected(runCli({ customer: { yearsWithMHPCO: 0 }, steps }));
  });
  it("claim damaging an unknown item type -> non-zero exit, error on stderr, nothing on stdout", () => {
    const steps = [swordPolicy, claimOf([{ itemType: "broomstick", amount: 300 }])];
    expectRejected(runCli({ customer: { yearsWithMHPCO: 0 }, steps }));
  });
  it("claim with two sword damages but only one sword insured -> non-zero exit, error on stderr, nothing on stdout", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    expectRejected(runCli({ customer: { yearsWithMHPCO: 0 }, steps: [swordPolicy, claimOf(damages)] }));
  });
  it("claim with damage amount -200 -> non-zero exit, error on stderr, nothing on stdout", () => {
    const steps = [swordPolicy, claimOf([{ itemType: "sword", amount: -200 }])];
    expectRejected(runCli({ customer: { yearsWithMHPCO: 0 }, steps }));
  });
});
