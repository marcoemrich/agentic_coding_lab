import { describe, it, expect } from "vitest";
import { processScenario, type Item } from "./claim-office.js";

// Note: quote premiums below include the 10 % first-insurance surcharge
// (every quoted item is a first insurance) and the 5 G processing fee.

const quote = (items: Item[], yearsWithMHPCO = 0): number => {
  const { results } = processScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
};

type Damage = { itemType: string; amount: number };

// Quotes `items` (step 0), then files one claim per entry in `claims` against that policy.
const claims = (items: Item[], ...damagesPerClaim: Damage[][]) =>
  processScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      ...damagesPerClaim.map((damages) => ({
        op: "claim" as const,
        policy: 0,
        incident: { cause: "dragon attack", damages },
      })),
    ],
  }).results.slice(1);

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      expect(quote([])).toBe(5);
    });
    it("plain sword for a newcomer → 100 base + 10 first insurance + 5 fee = 115 G", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: false }])).toBe(115);
    });
    it("plain amulet / staff / potion → 71 G / 93 G / 49 G (60/80/40 base + 10 % + 5)", () => {
      expect(quote([{ type: "amulet" }])).toBe(71);
      expect(quote([{ type: "staff" }])).toBe(93);
      expect(quote([{ type: "potion" }])).toBe(49);
    });
    it("2 runes → 50 G base premium → 60 G", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes → 60 G base premium (block applies) → 71 G", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3) → 115 G", () => {
      expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
    });
    it("7 runes → 175 G base premium → 197.5 G rounded up to 198 G", () => {
      expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types) → 88 G", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) → 137 G", () => {
      const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
      const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
      expect(quote([...runes, ...moonstones])).toBe(137);
    });
    it("cursed sword for a newcomer → 100 + 50 curse + 10 first insurance + 5 fee = 165 G", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("cursed sword + plain amulet → curse applies only to sword: 160 + 50 + 16 + 5 = 231 G", () => {
      expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies → 145 G", () => {
      expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with exactly enchantment 5 → both surcharges apply → 195 G", () => {
      expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge → 115 G", () => {
      expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("cursed sword with enchantment 4 → only curse surcharge → 165 G", () => {
      expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    });
    it("customer with exactly 2 years → loyalty discount applies: 100 − 20 + 10 + 5 = 95 G", () => {
      expect(quote([{ type: "sword" }], 2)).toBe(95);
    });
    it("long-standing customer's second quote, cursed sword enchantment 7 → 160 G", () => {
      const { results } = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
    it("unknown item type (broomstick) → throws an error", () => {
      expect(() => quote([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
  });

  describe("claim", () => {
    it("regular steel sword enchantment 3, damage 500 G → payout 400 G, remaining cap 1600 G", () => {
      expect(
        claims([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("rune, damage 200 G → payout 100 G, remaining cap 400 G", () => {
      expect(claims([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual([
        { payout: 100, remainingCap: 400 },
      ]);
    });
    it("steel sword enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
      expect(
        claims([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("dragon-material sword enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
      expect(
        claims([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("dragon-material sword exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      expect(
        claims([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]),
      ).toEqual([{ payout: 400, remainingCap: 1600 }]);
    });
    it("dragon-material sword enchantment 5, damage 800 G → payout 700 G", () => {
      expect(
        claims([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]),
      ).toEqual([{ payout: 700, remainingCap: 1300 }]);
    });
    it("payout calculation yielding 350.5 G → 350 G (rounded down)", () => {
      // enchantment 8: 901 / 2 − 100 = 350.5
      expect(claims([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }])).toEqual([
        { payout: 350, remainingCap: 1650 },
      ]);
    });
    it("sword (500 G) and amulet (300 G) damaged → deductible per item → payout 600 G", () => {
      expect(
        claims(
          [{ type: "sword" }, { type: "amulet" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        ),
      ).toEqual([{ payout: 600, remainingCap: 2600 }]);
    });
    it("sword + amulet policy → insurance sum 1600 G, cap 3200 G", () => {
      expect(
        claims([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 5000 }]),
      ).toEqual([{ payout: 3200, remainingCap: 0 }]);
    });
    it("cursed sword → cap 2000 G based on unmodified insurance value", () => {
      expect(
        claims([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 3000 }]),
      ).toEqual([{ payout: 2000, remainingCap: 0 }]);
    });
    it("sword + 3 runes (block) → insurance sum 1750 G, cap 3500 G", () => {
      expect(
        claims(
          [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          [{ itemType: "sword", amount: 1000 }],
        ),
      ).toEqual([{ payout: 900, remainingCap: 2600 }]);
    });
    it("two swords → cap 4000 G; two sword damages each with own deductible", () => {
      expect(
        claims(
          [{ type: "sword" }, { type: "sword" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
          [
            { itemType: "sword", amount: 2500 },
            { itemType: "sword", amount: 2500 },
          ],
        ),
      ).toEqual([
        { payout: 600, remainingCap: 3400 },
        { payout: 3400, remainingCap: 0 },
      ]);
    });
    it("two successive 1500 G claims on a sword → payouts 1400 G then 600 G, remaining cap 600 G then 0 G", () => {
      expect(
        claims([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }], [{ itemType: "sword", amount: 1500 }]),
      ).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("more damage entries of a type than insured items → throws, whole claim rejected", () => {
      expect(() =>
        claims(
          [{ type: "sword" }],
          [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        ),
      ).toThrow(/sword/);
    });
    it("damage to an item not in the policy (amulet when only sword insured) → throws", () => {
      expect(() => claims([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(/amulet/);
    });
    it("damage to an unknown item type → throws", () => {
      expect(() => claims([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow(/broomstick/);
    });
    it("damage entry with negative amount → throws", () => {
      expect(() => claims([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
    });
  });

  describe("scenario", () => {
    it("schema example: amulet quote for 5-year customer then fire claim → results in step order", () => {
      expect(
        processScenario({
          customer: { yearsWithMHPCO: 5 },
          steps: [
            {
              op: "quote",
              items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    });
  });
});
