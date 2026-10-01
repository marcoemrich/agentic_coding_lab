import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario, type ItemInput } from "./claim-office.js";

const items = (type: string, count: number): ItemInput[] => Array.from({ length: count }, () => ({ type }));

function quotePremiums(years: number, ...quotes: ItemInput[][]): number[] {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: years },
    steps: quotes.map((items) => ({ op: "quote", items })),
  });
  return results.map((result) => ("premium" in result ? result.premium : NaN));
}

function claimResults(policy: ItemInput[], ...claims: { itemType: string; amount: number }[][]) {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: policy },
      ...claims.map((damages) => ({ op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } })),
    ],
  });
  return results.slice(1);
}

function runCli(scenario: unknown) {
  return spawnSync("npx", ["tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
}

function claimScenario(policy: ItemInput[], damages: { itemType: string; amount: number }[]) {
  return {
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: policy },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  };
}

function expectRejected(scenario: unknown) {
  const run = runCli(scenario);
  expect(run.status).not.toBe(0);
  expect(run.stderr).not.toBe("");
  expect(run.stdout).toBe("");
}

// Readings adopted where the specification leaves details open:
// - "first insurance" (+10 %) applies to every quote; "follow-up contract" (-15 %) applies
//   to every quote after the customer's first quote within the scenario.
// - Component blocks are counted per exact component type and apply only when exactly 3
//   components of that type are on the policy.
// - Rejections are observable at the CLI: non-zero exit code, an error description on
//   stderr, and no results on stdout.

describe("quote: base premiums (newcomer, first contract: +10 % first insurance, +5 G fee)", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quotePremiums(0, [])).toEqual([5]);
  });
  it("plain sword -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    expect(quotePremiums(0, [{ type: "sword" }])).toEqual([115]);
  });
  it("plain amulet -> premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    expect(quotePremiums(0, [{ type: "amulet" }])).toEqual([71]);
  });
  it("plain staff -> premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    expect(quotePremiums(0, [{ type: "staff" }])).toEqual([93]);
  });
  it("plain potion -> premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    expect(quotePremiums(0, [{ type: "potion" }])).toEqual([49]);
  });
  it("1 rune -> premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5, rounded up)", () => {
    expect(quotePremiums(0, [{ type: "rune" }])).toEqual([33]);
  });
  it("1 moonstone -> premium 33 G (25 base, same as a rune)", () => {
    expect(quotePremiums(0, [{ type: "moonstone" }])).toEqual([33]);
  });
});

describe("quote: building block of 3 alike components", () => {
  it("2 runes -> 50 G base premium -> premium 60 G", () => {
    expect(quotePremiums(0, items("rune", 2))).toEqual([60]);
  });
  it("3 runes -> 60 G base premium (block) -> premium 71 G", () => {
    expect(quotePremiums(0, items("rune", 3))).toEqual([71]);
  });
  it("4 runes -> 100 G base premium (no block) -> premium 115 G", () => {
    expect(quotePremiums(0, items("rune", 4))).toEqual([115]);
  });
  it("7 runes -> 175 G base premium (no block) -> premium 198 G (197.5 rounded up)", () => {
    expect(quotePremiums(0, items("rune", 7))).toEqual([198]);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (different types, no block) -> premium 88 G", () => {
    expect(quotePremiums(0, [...items("rune", 2), { type: "moonstone" }])).toEqual([88]);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two blocks) -> premium 137 G", () => {
    expect(quotePremiums(0, [...items("rune", 3), ...items("moonstone", 3)])).toEqual([137]);
  });
});

describe("quote: item-specific modifiers", () => {
  it("newcomer with a cursed steel sword, enchantment 3 -> premium 165 G", () => {
    expect(quotePremiums(0, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual([165]);
  });
  it("cursed sword + plain amulet -> curse surcharge only on the sword: 160 + 50 + 16 + 5 -> premium 231 G", () => {
    expect(quotePremiums(0, [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toEqual([231]);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies -> premium 145 G", () => {
    expect(quotePremiums(0, [{ type: "sword", enchantment: 5 }])).toEqual([145]);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge -> premium 115 G", () => {
    expect(quotePremiums(0, [{ type: "sword", enchantment: 4 }])).toEqual([115]);
  });
  it("cursed sword with exactly enchantment 5 -> both surcharges -> premium 195 G", () => {
    expect(quotePremiums(0, [{ type: "sword", enchantment: 5, cursed: true }])).toEqual([195]);
  });
  it("cursed sword with enchantment 4 -> only the curse surcharge -> premium 165 G", () => {
    expect(quotePremiums(0, [{ type: "sword", enchantment: 4, cursed: true }])).toEqual([165]);
  });
});

describe("quote: policy-wide modifiers", () => {
  it("customer with exactly 2 years -> loyalty discount on a plain sword -> premium 95 G", () => {
    expect(quotePremiums(2, [{ type: "sword" }])).toEqual([95]);
  });
  it("customer with 1 year -> no loyalty discount on a plain sword -> premium 115 G", () => {
    expect(quotePremiums(1, [{ type: "sword" }])).toEqual([115]);
  });
  it("second quote of a newcomer -> follow-up discount: plain sword -> premiums 115 G then 100 G", () => {
    expect(quotePremiums(0, [{ type: "sword" }], [{ type: "sword" }])).toEqual([115, 100]);
  });
  it("3-year customer's second quote, cursed steel sword enchantment 7 -> premium 160 G", () => {
    const secondSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quotePremiums(3, [{ type: "amulet" }], [secondSword])[1]).toBe(160);
  });
  it("second quote of a newcomer: cursed sword + 2 runes -> 197.5 G -> premium 198 G (rounded up)", () => {
    const policy = [{ type: "sword", cursed: true }, ...items("rune", 2)];
    expect(quotePremiums(0, [], policy)[1]).toBe(198);
  });
});

describe("claim: reimbursement clauses", () => {
  it("regular steel sword, enchantment 3, damage 500 G -> payout 400 G, remaining cap 1600 G", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 3 }];
    expect(claimResults(policy, [{ itemType: "sword", amount: 500 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("rune, damage 200 G -> payout 100 G, remaining cap 400 G", () => {
    expect(claimResults([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual([{ payout: 100, remainingCap: 400 }]);
  });
  it("steel sword, enchantment 9, damage 1000 G -> payout 400 G", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 9 }];
    expect(claimResults(policy, [{ itemType: "sword", amount: 1000 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 5 }];
    expect(claimResults(policy, [{ itemType: "sword", amount: 800 }])).toEqual([{ payout: 700, remainingCap: 1300 }]);
  });
  it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50 % rule wins)", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 9 }];
    expect(claimResults(policy, [{ itemType: "sword", amount: 1000 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("dragon-material sword, exactly enchantment 8, damage 1000 G -> payout 400 G", () => {
    const policy = [{ type: "sword", material: "dragon", enchantment: 8 }];
    expect(claimResults(policy, [{ itemType: "sword", amount: 1000 }])).toEqual([{ payout: 400, remainingCap: 1600 }]);
  });
  it("steel sword, enchantment 9, damage 901 G -> 350.5 G -> payout 350 G (rounded down)", () => {
    const policy = [{ type: "sword", material: "steel", enchantment: 9 }];
    expect(claimResults(policy, [{ itemType: "sword", amount: 901 }])).toEqual([{ payout: 350, remainingCap: 1650 }]);
  });
});

describe("claim: deductible and multiple items", () => {
  it("sword damaged 500 G and amulet damaged 300 G -> payout 600 G, remaining cap 2600 G", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claimResults([{ type: "sword" }, { type: "amulet" }], damages)).toEqual([{ payout: 600, remainingCap: 2600 }]);
  });
  it("two swords insured, both damaged 500 G -> payout 800 G, remaining cap 3200 G (cap 4000 G)", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expect(claimResults(items("sword", 2), damages)).toEqual([{ payout: 800, remainingCap: 3200 }]);
  });
  it("claim refers to its policy by step index: amulet policy at step 1, damage 300 G -> payout 200 G, remaining cap 1000 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
      ],
    });
    expect(results[2]).toEqual({ payout: 200, remainingCap: 1000 });
  });
});

describe("claim: cap from insurance values", () => {
  it("sword, two successive claims of 1500 G -> payout 1400 G / cap 600 G, then payout 600 G / cap 0 G", () => {
    const damages = [{ itemType: "sword", amount: 1500 }];
    expect(claimResults([{ type: "sword" }], damages, damages)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("cursed sword, damage 5000 G -> payout 2000 G, remaining cap 0 G (cap from unmodified value)", () => {
    const damages = [{ itemType: "sword", amount: 5000 }];
    expect(claimResults([{ type: "sword", cursed: true }], damages)).toEqual([{ payout: 2000, remainingCap: 0 }]);
  });
  it("sword + 3 runes, sword damage 5000 G -> payout 3500 G, remaining cap 0 G (insurance sum 1750 G)", () => {
    const damages = [{ itemType: "sword", amount: 5000 }];
    expect(claimResults([{ type: "sword" }, ...items("rune", 3)], damages)).toEqual([{ payout: 3500, remainingCap: 0 }]);
  });
  it("amulet, damage 5000 G -> payout 1200 G (insurance value 600 G)", () => {
    expect(claimResults([{ type: "amulet" }], [{ itemType: "amulet", amount: 5000 }])).toEqual([{ payout: 1200, remainingCap: 0 }]);
  });
  it("staff, damage 5000 G -> payout 1600 G (insurance value 800 G)", () => {
    expect(claimResults([{ type: "staff" }], [{ itemType: "staff", amount: 5000 }])).toEqual([{ payout: 1600, remainingCap: 0 }]);
  });
  it("potion, damage 5000 G -> payout 800 G (insurance value 400 G)", () => {
    expect(claimResults([{ type: "potion" }], [{ itemType: "potion", amount: 5000 }])).toEqual([{ payout: 800, remainingCap: 0 }]);
  });
  it("rune, damage 5000 G -> payout 500 G (insurance value 250 G)", () => {
    expect(claimResults([{ type: "rune" }], [{ itemType: "rune", amount: 5000 }])).toEqual([{ payout: 500, remainingCap: 0 }]);
  });
  it("moonstone, damage 5000 G -> payout 500 G (insurance value 250 G)", () => {
    expect(claimResults([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 5000 }])).toEqual([{ payout: 500, remainingCap: 0 }]);
  });
});

describe("claim-office CLI", () => {
  it("schema example: 5-year customer, amulet quote then fire claim 200 G -> {results: [{premium: 59}, {payout: 100, remainingCap: 1100}]}", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(run.status).toBe(0);
  });
  it("quote with unknown item type 'broomstick' -> non-zero exit, error on stderr, nothing on stdout", () => {
    expectRejected({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
  });
  it("claim damaging an amulet when only a sword is insured -> non-zero exit, error on stderr, nothing on stdout", () => {
    expectRejected(claimScenario([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }]));
  });
  it("claim damaging an unknown item type -> non-zero exit, error on stderr, nothing on stdout", () => {
    expectRejected(claimScenario([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }]));
  });
  it("claim with two sword damages but one sword insured -> non-zero exit, error on stderr, nothing on stdout", () => {
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    expectRejected(claimScenario([{ type: "sword" }], damages));
  });
  it("claim with damage amount -200 -> non-zero exit, error on stderr, nothing on stdout", () => {
    expectRejected(claimScenario([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]));
  });
});
