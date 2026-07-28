import { describe, it, expect } from "vitest";
import {
  basePremium,
  insuranceSum,
  quotePremium,
  roundPremium,
  roundPayout,
  runScenario,
} from "./claim-office.js";

describe("MHPCO base premium (price list + component blocks)", () => {
  it("main items follow the price list -- sword 100, amulet 60, staff 80, potion 40", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
    expect(basePremium([{ type: "amulet" }])).toBe(60);
    expect(basePremium([{ type: "staff" }])).toBe(80);
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });
  it("2 runes -> 50 G base premium (no block)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    expect(
      basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])
    ).toBe(60);
  });
  it("4 runes -> 100 G base premium (no block, block requires exactly 3)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])
    ).toBe(100);
  });
  it("7 runes -> 175 G base premium", () => {
    expect(basePremium(Array(7).fill({ type: "rune" }))).toBe(175);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ])
    ).toBe(75);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    expect(
      basePremium([
        ...Array(3).fill({ type: "rune" }),
        ...Array(3).fill({ type: "moonstone" }),
      ])
    ).toBe(120);
  });
  it("cursed sword + plain amulet -> policy base premium 160 G (sum of item bases)", () => {
    expect(
      basePremium([
        { type: "sword", cursed: true },
        { type: "amulet" },
      ])
    ).toBe(160);
  });
});

describe("MHPCO insurance sum", () => {
  it("sword + amulet -> insurance sum 1600 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("sword + 3 runes -> insurance sum 1750 G (block affects premium only)", () => {
    expect(
      insuranceSum([{ type: "sword" }, ...Array(3).fill({ type: "rune" })])
    ).toBe(1750);
  });
  it("two swords -> insurance sum 2000 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
});

describe("MHPCO rounding in favor", () => {
  it("premium 197.5 G -> 198 G (rounded up)", () => {
    expect(roundPremium(197.5)).toBe(198);
  });
  it("payout 350.5 G -> 350 G (rounded down)", () => {
    expect(roundPayout(350.5)).toBe(350);
  });
});

describe("MHPCO quote premium (modifiers + fee)", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quotePremium([], { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(5);
  });
  it("newcomer plain sword -> premium 115 G (100 base + 10 first + 5 fee)", () => {
    expect(
      quotePremium([{ type: "sword" }], { yearsWithMHPCO: 0, contractIndex: 0 })
    ).toBe(115);
  });
  it("cursed surcharge: newcomer cursed sword (ench 3) -> premium 165 G", () => {
    expect(
      quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], {
        yearsWithMHPCO: 0,
        contractIndex: 0,
      })
    ).toBe(165);
  });
  it("high-enchantment ench 5 -> premium 145 G (100 + 30 + 10 first + 5)", () => {
    expect(
      quotePremium([{ type: "sword", material: "steel", enchantment: 5 }], {
        yearsWithMHPCO: 0,
        contractIndex: 0,
      })
    ).toBe(145);
  });
  it("ench 4 -> no high-enchantment surcharge -> premium 115 G", () => {
    expect(
      quotePremium([{ type: "sword", material: "steel", enchantment: 4 }], {
        yearsWithMHPCO: 0,
        contractIndex: 0,
      })
    ).toBe(115);
  });
  it("ench 5 + cursed -> both surcharges -> premium 195 G", () => {
    expect(
      quotePremium(
        [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        { yearsWithMHPCO: 0, contractIndex: 0 }
      )
    ).toBe(195);
  });
  it("loyalty at exactly 2 years -> plain sword premium 95 G (100 + 10 - 20 + 5)", () => {
    expect(
      quotePremium([{ type: "sword" }], { yearsWithMHPCO: 2, contractIndex: 0 })
    ).toBe(95);
  });
  it("less than 2 years -> no loyalty discount -> plain sword premium 115 G", () => {
    expect(
      quotePremium([{ type: "sword" }], { yearsWithMHPCO: 1, contractIndex: 0 })
    ).toBe(115);
  });
});

describe("MHPCO scenarios (quotes, follow-up contracts, claims)", () => {
  it("follow-up contract: second quote in scenario gets 15% discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[0].premium).toBe(115);
    expect(result.results[1].premium).toBe(100);
  });
  it("integration: long-standing customer's 2nd contract, cursed sword ench 7 -> premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[1].premium).toBe(160);
  });
  it("standard reimbursement: steel sword ench 3, damage 500 -> payout 400 (cap 2000)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(result.results[1].payout).toBe(400);
  });
  it("rune damage 200 (value 250) -> payout 100 (full minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "theft",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(100);
  });
  it("deductible per event: dragon attack sword 500 + amulet 300 -> payout 600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(600);
  });
  it("high-enchantment: steel sword ench 9, damage 1000 -> payout 400 (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(400);
  });
  it("dragon material: dragon sword ench 5, damage 800 -> payout 700 (full then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(700);
  });
  it("both clauses: dragon sword ench 9, damage 1000 -> payout 400 (50% wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(400);
  });
  it("dragon sword ench 8, damage 1000 -> payout 400 (high-enchantment clause + deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(400);
  });
  it("cap = twice insurance sum: sword + amulet -> remainingCap reflects cap 3200", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(2800);
  });
  it("cap exhaustion: sword, two claims of 1500 -> payout 1400 rem 600, then payout 600 rem 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });
  it("two swords: each damage entry treated separately with its own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    }) as { results: Array<{ payout?: number }> };
    expect(result.results[1].payout).toBe(600);
  });
  it("more damage entries of a type than covered -> throws (claim rejected)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      })
    ).toThrow();
  });
});

describe("MHPCO error handling", () => {
  it("quote with unknown item type -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })
    ).toThrow();
  });
  it("claim references an item not in the policy -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      })
    ).toThrow();
  });
  it("claim damage with negative amount -> throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      })
    ).toThrow();
  });
});
