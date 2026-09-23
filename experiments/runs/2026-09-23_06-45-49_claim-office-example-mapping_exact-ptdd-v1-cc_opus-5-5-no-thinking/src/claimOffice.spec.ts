import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claimOffice.js";

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

function quotePremium(items: Item[], yearsWithMHPCO = 0): number {
  const output = processScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (output.results[0] as { premium: number }).premium;
}

type Damage = { itemType: string; amount: number };

function claimResult(items: Item[], damages: Damage[]): unknown {
  const output = processScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return output.results[1];
}

const steelSword = (enchantment: number): Item => ({ type: "sword", material: "steel", enchantment, cursed: false });
const dragonSword = (enchantment: number): Item => ({ type: "sword", material: "dragon", enchantment, cursed: false });

describe("quote", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quotePremium([])).toBe(5);
  });
  it("plain sword, newcomer -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 0, cursed: false }])).toBe(115);
  });
  it("plain amulet, newcomer -> premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "amulet", material: "silver", enchantment: 0, cursed: false }])).toBe(71);
  });
  it("plain staff, newcomer -> premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "staff", material: "oak", enchantment: 0, cursed: false }])).toBe(93);
  });
  it("plain potion, newcomer -> premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "potion", material: "glass", enchantment: 0, cursed: false }])).toBe(49);
  });
  it("1 rune, newcomer -> premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5, rounded up)", () => {
    expect(quotePremium([{ type: "rune" }])).toBe(33);
  });
  it("1 moonstone, newcomer -> premium 33 G (25 base, rounded up)", () => {
    expect(quotePremium([{ type: "moonstone" }])).toBe(33);
  });
  it("2 runes -> 50 G base premium -> premium 60 G", () => {
    expect(quotePremium([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("3 runes -> 60 G base premium (block) -> premium 71 G", () => {
    expect(quotePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("3 moonstones -> 60 G base premium (block) -> premium 71 G", () => {
    expect(quotePremium([{ type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }])).toBe(71);
  });
  it("4 runes -> 100 G base premium (no block) -> premium 115 G", () => {
    expect(quotePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("7 runes -> 175 G base premium -> 197.5 G rounded up to premium 198 G", () => {
    expect(quotePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (different types, no block) -> premium 88 G", () => {
    expect(quotePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two blocks) -> premium 137 G", () => {
    const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(quotePremium([...runes, ...moonstones])).toBe(137);
  });
  it("newcomer with a cursed steel sword, enchantment 3 -> premium 165 G", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("cursed sword + plain amulet, newcomer -> curse on sword only: 160 + 50 + 16 first insurance + 5 fee = 231 G", () => {
    expect(
      quotePremium([
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ]),
    ).toBe(231);
  });
  it("sword with enchantment 4, not cursed -> no high-enchantment surcharge -> premium 115 G", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(115);
  });
  it("sword with exactly enchantment 5, not cursed -> 30% surcharge -> premium 145 G", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
  });
  it("cursed sword with exactly enchantment 5 -> both surcharges -> premium 195 G", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("cursed sword with enchantment 4 -> only curse surcharge -> premium 165 G", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("customer with 1 year -> no loyalty discount -> plain sword premium 115 G", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 0, cursed: false }], 1)).toBe(115);
  });
  it("customer with exactly 2 years -> 20% loyalty discount -> plain sword premium 95 G", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 0, cursed: false }], 2)).toBe(95);
  });
  it("second quote in the scenario, newcomer -> 15% follow-up discount -> plain sword premium 100 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 0, cursed: false };
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });
    expect(output.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("long-standing customer's second contract: 3 years, cursed sword enchantment 7 -> premium 160 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(output.results[1]).toEqual({ premium: 160 });
  });
});

describe("claim", () => {
  it("schema example: 5-year customer, amulet damaged 200 G -> payout 100 G, remaining cap 1100 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(output.results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
  it("regular steel sword enchantment 3, damage 500 G -> payout 400 G, remaining cap 1600 G", () => {
    expect(claimResult([steelSword(3)], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G -> payout 100 G, remaining cap 400 G", () => {
    expect(claimResult([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("staff (value 800 G) damage 200 G -> payout 100 G, remaining cap 1500 G", () => {
    expect(claimResult([{ type: "staff" }], [{ itemType: "staff", amount: 200 }])).toEqual({ payout: 100, remainingCap: 1500 });
  });
  it("potion (value 400 G) damage 200 G -> payout 100 G, remaining cap 700 G", () => {
    expect(claimResult([{ type: "potion" }], [{ itemType: "potion", amount: 200 }])).toEqual({ payout: 100, remainingCap: 700 });
  });
  it("moonstone (value 250 G) damage 200 G -> payout 100 G, remaining cap 400 G", () => {
    expect(claimResult([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("steel sword enchantment 9, damage 1000 G -> 50% then deductible -> payout 400 G", () => {
    expect(claimResult([steelSword(9)], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("steel sword enchantment 7, damage 1000 G -> below 50% threshold -> payout 900 G", () => {
    expect(claimResult([steelSword(7)], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 900, remainingCap: 1100 });
  });
  it("dragon-material sword exactly enchantment 8, damage 1000 G -> payout 400 G", () => {
    expect(claimResult([dragonSword(8)], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 9, damage 1000 G -> 50% rule wins -> payout 400 G", () => {
    expect(claimResult([dragonSword(9)], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 5, damage 800 G -> full reimbursement -> payout 700 G, remaining cap 1300 G", () => {
    expect(claimResult([dragonSword(5)], [{ itemType: "sword", amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("sword 500 G + amulet 300 G damaged in one event -> deductible per item -> payout 600 G, remaining cap 2600 G", () => {
    const amulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    expect(
      claimResult(
        [steelSword(3), amulet],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("sword + amulet policy -> cap 3200 G: sword damage 200 G -> payout 100 G, remaining cap 3100 G", () => {
    const amulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    expect(claimResult([steelSword(3), amulet], [{ itemType: "sword", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 3100,
    });
  });
  it("cursed sword (premium 165 G) -> cap 2000 G from unmodified value: damage 500 G -> payout 400 G, remaining cap 1600 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "curse backfire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(output.results).toEqual([{ premium: 165 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("sword + 3 runes -> cap 3500 G: sword damage 200 G -> payout 100 G, remaining cap 3400 G", () => {
    const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(claimResult([steelSword(3), ...runes], [{ itemType: "sword", amount: 200 }])).toEqual({
      payout: 100,
      remainingCap: 3400,
    });
  });
  it("two swords -> cap 4000 G: both damaged 500 G each -> payout 800 G, remaining cap 3200 G", () => {
    expect(
      claimResult(
        [steelSword(3), steelSword(3)],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      ),
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("two successive claims of 1500 G on a sword -> payouts 1400 G then 600 G, remaining cap 600 G then 0 G", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "troll", damages: [{ itemType: "sword", amount: 1500 }] } };
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [steelSword(3)] }, claim, claim],
    });
    expect(output.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("steel sword enchantment 9, damage 901 G -> 350.5 G rounded down to payout 350 G, remaining cap 1650 G", () => {
    expect(claimResult([steelSword(9)], [{ itemType: "sword", amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("claim references the second quote's policy by step index 1 -> amulet damage 300 G -> payout 200 G, remaining cap 1000 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [steelSword(3)] },
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
      ],
    });
    expect(output.results[2]).toEqual({ payout: 200, remainingCap: 1000 });
  });
});

function runCli(scenario: unknown): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function runClaimCli(damages: Damage[]): { status: number | null; stdout: string; stderr: string } {
  return runCli({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: [steelSword(3)] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
}

function expectRejected(result: { status: number | null; stdout: string; stderr: string }): void {
  expect(result.status).not.toBe(0);
  expect(result.stderr).not.toBe("");
  expect(result.stdout).toBe("");
}

describe("claim-office CLI", () => {
  it("reads the schema example from stdin and writes results JSON to stdout with exit code 0", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("quote with unknown item type broomstick -> non-zero exit, error on stderr, no results on stdout", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("claim damaging an uninsured amulet -> non-zero exit, error on stderr, no results on stdout", () => {
    expectRejected(runClaimCli([{ itemType: "amulet", amount: 200 }]));
  });
  it("claim damaging an unknown item type -> non-zero exit, error on stderr, no results on stdout", () => {
    expectRejected(runClaimCli([{ itemType: "broomstick", amount: 200 }]));
  });
  it("claim with damage amount -200 -> non-zero exit, error on stderr, no results on stdout", () => {
    expectRejected(runClaimCli([{ itemType: "sword", amount: -200 }]));
  });
  it("claim with two sword damages but only one sword insured -> non-zero exit, whole claim rejected", () => {
    expectRejected(
      runClaimCli([
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ]),
    );
  });
});
