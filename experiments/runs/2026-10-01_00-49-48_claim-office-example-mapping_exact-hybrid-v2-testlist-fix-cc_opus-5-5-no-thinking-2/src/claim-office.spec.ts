import { describe, it, expect } from "vitest";
import { runScenario, type Item, type QuoteResult } from "./claim-office.js";

const runes = (count: number): Item[] =>
  Array.from({ length: count }, () => ({ type: "rune" }));

const premiumFor = (items: Item[], yearsWithMHPCO = 1): number => {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as QuoteResult).premium;
};

type Damage = { itemType: string; amount: number };

const claimAgainst = (items: Item[], ...claims: Damage[][]) => {
  const { results } = runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      ...claims.map((damages) => ({
        op: "claim" as const,
        policy: 0,
        incident: { cause: "dragon attack", damages },
      })),
    ],
  });
  return results.slice(1);
};

describe("Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("plain sword for a 1-year customer → 100 base + 10 first insurance + 5 fee = 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("plain amulet → 60 base + 6 first insurance + 5 fee = 71 G", () => {
      expect(premiumFor([{ type: "amulet" }])).toBe(71);
    });
    it("plain staff → 80 base + 8 first insurance + 5 fee = 93 G", () => {
      expect(premiumFor([{ type: "staff" }])).toBe(93);
    });
    it("plain potion → 40 base + 4 first insurance + 5 fee = 49 G", () => {
      expect(premiumFor([{ type: "potion" }])).toBe(49);
    });
  });

  describe("quote — components and building blocks", () => {
    it("2 runes → 50 G base premium (premium 50 + 5 + 5 = 60 G)", () => {
      expect(premiumFor(runes(2))).toBe(60);
    });
    it("3 runes → 60 G base premium, block applies (premium 60 + 6 + 5 = 71 G)", () => {
      expect(premiumFor(runes(3))).toBe(71);
    });
    it("4 runes → 100 G base premium, no block (premium 100 + 10 + 5 = 115 G)", () => {
      expect(premiumFor(runes(4))).toBe(115);
    });
    it("7 runes → 175 G base premium (premium 175 + 17.5 + 5 = 197.5 → 198 G)", () => {
      expect(premiumFor(runes(7))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium, no block across types (premium 75 + 7.5 + 5 = 87.5 → 88 G)", () => {
      expect(premiumFor([...runes(2), { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium, two separate blocks (premium 120 + 12 + 5 = 137 G)", () => {
      const moonstones: Item[] = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
      expect(premiumFor([...runes(3), ...moonstones])).toBe(137);
    });
  });

  describe("quote — premium modifiers", () => {
    it("newcomer with a cursed steel sword, enchantment 3 → 165 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
      expect(premiumFor([sword], 0)).toBe(165);
    });
    it("sword with enchantment 4 (not cursed) → no high-enchantment surcharge → 115 G", () => {
      expect(premiumFor([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies → 100 + 30 + 10 + 5 = 145 G", () => {
      expect(premiumFor([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("cursed sword with enchantment 5 → both surcharges → 100 + 50 + 30 + 10 + 5 = 195 G", () => {
      expect(premiumFor([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("customer with exactly 2 years → loyalty discount applies → 100 − 20 + 10 + 5 = 95 G", () => {
      expect(premiumFor([{ type: "sword" }], 2)).toBe(95);
    });
    it("cursed surcharge applies only to the cursed item: cursed sword + plain amulet → 160 + 50 + 16 + 5 = 231 G", () => {
      expect(premiumFor([{ type: "sword", cursed: true }, { type: "amulet" }], 0)).toBe(231);
    });
    it("follow-up contract gets 15 % discount: second quote of a plain sword for a 0-year customer → 100 + 10 − 15 + 5 = 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → 160 G (first insurance still applies)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
    it("premium fractions are rounded up in MHPCO's favor (2 runes + 1 moonstone, 2-year customer: 75 − 15 + 7.5 + 5 = 72.5 → 73 G)", () => {
      expect(premiumFor([...runes(2), { type: "moonstone" }], 2)).toBe(73);
    });
  });

  describe("claim — reimbursement", () => {
    it("regular steel sword, enchantment 3, damage 500 → payout 400, remainingCap 1600", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3 };
      expect(claimAgainst([sword], [{ itemType: "sword", amount: 500 }])).toEqual([
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("rune (no enchantment/material, insurance value 250), damage 200 → payout 100, remainingCap 400", () => {
      expect(claimAgainst([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual([
        { payout: 100, remainingCap: 400 },
      ]);
    });
    it("steel sword, enchantment 9, damage 1000 → payout 400 (50 % then deductible)", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };
      expect(claimAgainst([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("dragon-material sword, enchantment 9, damage 1000 → payout 400 (50 % rule wins)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 9 };
      expect(claimAgainst([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("dragon-material sword, enchantment 5, damage 800 → payout 700", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 5 };
      expect(claimAgainst([sword], [{ itemType: "sword", amount: 800 }])).toEqual([
        { payout: 700, remainingCap: 1300 },
      ]);
    });
    it("dragon-material sword, exactly enchantment 8, damage 1000 → payout 400", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 8 };
      expect(claimAgainst([sword], [{ itemType: "sword", amount: 1000 }])).toEqual([
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("deductible applies per damaged item: sword 500 + amulet 300 → payout 600", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ];
      expect(claimAgainst([{ type: "sword" }, { type: "amulet" }], damages)).toEqual([
        { payout: 600, remainingCap: 2600 },
      ]);
    });
    it("payout fractions are rounded down in MHPCO's favor (enchantment 9, damage 901 → 450.5 − 100 = 350.5 → 350)", () => {
      const sword = { type: "sword", enchantment: 9 };
      expect(claimAgainst([sword], [{ itemType: "sword", amount: 901 }])).toEqual([
        { payout: 350, remainingCap: 1650 },
      ]);
    });
    it("damage below deductible yields payout 0, not negative", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 50 },
      ];
      expect(claimAgainst([{ type: "sword" }, { type: "amulet" }], damages)).toEqual([
        { payout: 400, remainingCap: 2800 },
      ]);
    });
  });

  describe("claim — cap", () => {
    it("policy with sword + amulet → cap 3200 G (remainingCap after 0-payout claim is 3200)", () => {
      expect(
        claimAgainst([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 100 }]),
      ).toEqual([{ payout: 0, remainingCap: 3200 }]);
    });
    it("cursed sword cap is based on unmodified insurance value → cap 2000 G", () => {
      expect(
        claimAgainst([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 100 }]),
      ).toEqual([{ payout: 0, remainingCap: 2000 }]);
    });
    it("sword + 3 runes block → insurance sum 1750, cap 3500 G", () => {
      expect(
        claimAgainst([{ type: "sword" }, ...runes(3)], [{ itemType: "rune", amount: 100 }]),
      ).toEqual([{ payout: 0, remainingCap: 3500 }]);
    });
    it("two swords → insurance sum 2000, cap 4000; damaging both treats each with its own deductible", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ];
      expect(claimAgainst([{ type: "sword" }, { type: "sword" }], damages)).toEqual([
        { payout: 600, remainingCap: 3400 },
      ]);
    });
    it("two successive 1500 G claims on a sword → payouts 1400 (remaining 600) then 600 (remaining 0)", () => {
      const claim = [{ itemType: "sword", amount: 1500 }];
      expect(claimAgainst([{ type: "sword" }], claim, claim)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("claims on different policies have independent caps", () => {
      const claim = { itemType: "sword", amount: 1500 };
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [claim] } },
          { op: "claim", policy: 1, incident: { cause: "fire", damages: [claim] } },
        ],
      });
      expect(results.slice(2)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 1400, remainingCap: 600 },
      ]);
    });
  });

  describe("errors", () => {
    it("quote with an unknown item type (broomstick) throws", () => {
      expect(() => premiumFor([{ type: "broomstick" }])).toThrow(/unknown item type: broomstick/i);
    });
    it("claim for an item not part of the policy (amulet when only a sword insured) throws", () => {
      expect(() =>
        claimAgainst([{ type: "sword" }], [{ itemType: "amulet", amount: 300 }]),
      ).toThrow(/not insured/i);
    });
    it("claim with an unknown item type throws", () => {
      expect(() =>
        claimAgainst([{ type: "sword" }], [{ itemType: "broomstick", amount: 300 }]),
      ).toThrow();
    });
    it("claim with more damage entries of a type than insured items throws", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ];
      expect(() => claimAgainst([{ type: "sword" }], damages)).toThrow(/not insured/i);
    });
    it("claim with a negative damage amount throws", () => {
      expect(() =>
        claimAgainst([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]),
      ).toThrow(/negative/i);
    });
  });

  describe("full scenario", () => {
    it("schema example: 5-year customer quotes silver amulet then claims 200 fire damage → [{premium: 59}, {payout: 100, remainingCap: 1100}]", () => {
      const result = runScenario({
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
      });
      expect(result).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    });
  });
});
