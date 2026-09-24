import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(input: unknown) {
  const { status, stdout, stderr } = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return { status, stdout, stderr };
}

const swordPolicy = { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] };
const claimOnFirstPolicy = (damages: { itemType: string; amount: number }[]) => ({
  op: "claim",
  policy: 0,
  incident: { cause: "dragon attack", damages },
});

function expectRejected(result: ReturnType<typeof runCli>, message: RegExp) {
  expect(result.status).not.toBe(0);
  expect(result.stderr).toMatch(message);
  expect(result.stdout).toBe("");
}

describe("claim-office CLI", () => {
  it("schema example (5 years, silver amulet quote + fire claim 200) -> stdout {results:[{premium:59},{payout:100,remainingCap:1100}]}, exit 0", () => {
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
  it("unknown item type 'broomstick' -> non-zero exit, error on stderr, no results on stdout", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expectRejected(result, /broomstick/);
  });
  it("damage for an item not in the policy -> non-zero exit, error on stderr, no results on stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [swordPolicy, claimOnFirstPolicy([{ itemType: "amulet", amount: 200 }])],
    });
    expectRejected(result, /amulet/);
  });
  it("more sword damages than insured swords -> non-zero exit, error on stderr, no results on stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        swordPolicy,
        claimOnFirstPolicy([
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]),
      ],
    });
    expectRejected(result, /sword/);
  });
  it("damage amount -200 -> non-zero exit, error on stderr, no results on stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [swordPolicy, claimOnFirstPolicy([{ itemType: "sword", amount: -200 }])],
    });
    expectRejected(result, /-200/);
  });
});
