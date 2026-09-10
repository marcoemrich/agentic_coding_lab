import { describe, it, expect } from "vitest";
import {
  runScenario,
  type ClaimResult,
  type Damage,
  type Item,
  type Scenario,
} from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0): number => {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
};

const claim = (items: Item[], damages: Damage[], yearsWithMHPCO = 0): ClaimResult => {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } },
    ],
  });
  return results[1] as ClaimResult;
};

describe("MHPCO Claim Office", () => {
  describe("quote: base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(results).toEqual([{ premium: 5 }]);
    });
    it("single sword (0 years, no modifiers) → base 100 + 10 first insurance + 5 fee = 115 G", () => {
      expect(quote([{ type: "sword" }])).toBe(115);
    });
    it("single amulet → base 60 G (+10% first insurance + 5 fee = 71 G)", () => {
      expect(quote([{ type: "amulet" }])).toBe(71);
    });
    it("single staff → base 80 G (+10% first insurance + 5 fee = 93 G)", () => {
      expect(quote([{ type: "staff" }])).toBe(93);
    });
    it("single potion → base 40 G (+10% first insurance + 5 fee = 49 G)", () => {
      expect(quote([{ type: "potion" }])).toBe(49);
    });
  });

  describe("quote: components and building blocks", () => {
    it("2 runes → 50 G base premium (60 G total)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes → 60 G base premium, block applies (71 G total)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("4 runes → 100 G base premium, no block (115 G total)", () => {
      expect(quote(Array(4).fill({ type: "rune" }))).toBe(115);
    });
    it("7 runes → 175 G base premium (198 G total, 197.5 rounded up)", () => {
      expect(quote(Array(7).fill({ type: "rune" }))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium, no block for different types (88 G total)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium, two separate blocks (137 G total)", () => {
      const items = [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })];
      expect(quote(items)).toBe(137);
    });
  });

  describe("quote: item-specific modifiers", () => {
    it("cursed sword → 50 % surcharge on the sword's base premium (165 G newcomer)", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("sword with enchantment 5 → high-enchantment surcharge applies (30 G)", () => {
      expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      expect(quote([{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("cursed sword with enchantment 5 → both surcharges apply (80 G)", () => {
      expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("cursed sword + plain amulet → surcharge applies only to the sword (210 G before policy modifiers)", () => {
      // 160 base + 50 curse + 16 first insurance + 5 fee
      expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
    });
  });

  describe("quote: policy-wide modifiers", () => {
    it("customer with exactly 2 years → 20 % loyalty discount applies", () => {
      // 100 base − 20 loyalty + 10 first insurance + 5 fee
      expect(quote([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount", () => {
      expect(quote([{ type: "sword" }], 1)).toBe(115);
    });
    it("second quote in a scenario → 15 % follow-up discount applies", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      // second: 100 base − 15 follow-up + 10 first insurance + 5 fee
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("first insurance surcharge still applies on a follow-up contract for a new item", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "amulet" }] },
        ],
      });
      // second: 60 base − 9 follow-up + 6 first insurance + 5 fee
      expect(results[1]).toEqual({ premium: 62 });
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → 160 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      // 100 + 50 curse + 30 enchantment − 20 loyalty + 10 first − 15 follow-up + 5 fee
      expect(results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote: rounding and errors", () => {
    it("premium of 197.5 G is rounded up to 198 G (in MHPCO's favor)", () => {
      // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5
      expect(quote(Array(7).fill({ type: "rune" }))).toBe(198);
    });
    it("unknown item type (broomstick) → throws an error", () => {
      expect(() => quote([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
  });

  describe("claim: standard reimbursement and deductible", () => {
    it("regular steel sword enchantment 3, damage 500 G → payout 400 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3 };
      expect(claim([sword], [{ itemType: "sword", amount: 500 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("rune damage 200 G → payout 100 G (no special clause)", () => {
      expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({
        payout: 100,
        remainingCap: 400,
      });
    });
    it("dragon attack damages sword (500) and amulet (300) → payout 600 G, deductible per damaged item", () => {
      const result = claim(
        [{ type: "sword" }, { type: "amulet" }],
        [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
      );
      expect(result).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim: special clauses", () => {
    it("steel sword enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
      const sword = { type: "sword", material: "steel", enchantment: 9 };
      expect(claim([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("dragon-material sword enchantment 5, damage 800 G → payout 700 G (full reimbursement)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 5 };
      expect(claim([sword], [{ itemType: "sword", amount: 800 }])).toEqual({
        payout: 700,
        remainingCap: 1300,
      });
    });
    it("dragon-material sword enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 9 };
      expect(claim([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("dragon-material sword exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const sword = { type: "sword", material: "dragon", enchantment: 8 };
      expect(claim([sword], [{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
  });

  describe("claim: insurance sum and cap", () => {
    it("sword + amulet → insurance sum 1600 G, cap 3200 G (remainingCap after zero-payout claim)", () => {
      const result = claim([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 100 }]);
      expect(result).toEqual({ payout: 0, remainingCap: 3200 });
    });
    it("cursed sword → cap 2000 G based on unmodified insurance value", () => {
      const result = claim([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 100 }]);
      expect(result).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it("sword + 3 runes → insurance sum 1750 G, cap 3500 G", () => {
      const items = [{ type: "sword" }, ...Array(3).fill({ type: "rune" })];
      expect(claim(items, [{ itemType: "sword", amount: 100 }])).toEqual({
        payout: 0,
        remainingCap: 3500,
      });
    });
    it("two swords → insurance sum 2000 G, cap 4000 G", () => {
      const result = claim([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 100 }]);
      expect(result).toEqual({ payout: 0, remainingCap: 4000 });
    });
    it("two successive 1500 G claims on a sword → 1400 G then 600 G, remaining cap 0", () => {
      const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident },
          { op: "claim", policy: 0, incident },
        ],
      });
      expect(results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("payout of 350.5 G is rounded down to 350 G (in MHPCO's favor)", () => {
      // enchantment 9: 901 × 50 % = 450.5, minus 100 deductible = 350.5
      const sword = { type: "sword", enchantment: 9 };
      expect(claim([sword], [{ itemType: "sword", amount: 901 }])).toEqual({
        payout: 350,
        remainingCap: 1650,
      });
    });
  });

  describe("claim: multiple items of the same type and errors", () => {
    it("two damaged swords on a two-sword policy → each has its own deductible", () => {
      const result = claim(
        [{ type: "sword" }, { type: "sword" }],
        [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
      );
      expect(result).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("more sword damages than swords insured → throws an error", () => {
      expect(() =>
        claim([{ type: "sword" }], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]),
      ).toThrow(/sword/);
    });
    it("damage to an item not part of the policy (amulet when only sword insured) → throws an error", () => {
      expect(() => claim([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(/amulet/);
    });
    it("damage with an unknown item type → throws an error", () => {
      expect(() => claim([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow(/broomstick/);
    });
    it("damage with negative amount (-200) → throws an error", () => {
      expect(() => claim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200|negative/);
    });
  });

  describe("scenario", () => {
    it("results array matches steps in length and order (schema example: quote then claim)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      // premium: 60 base − 12 loyalty + 6 first insurance + 5 fee = 59
      expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
    });
  });
});
