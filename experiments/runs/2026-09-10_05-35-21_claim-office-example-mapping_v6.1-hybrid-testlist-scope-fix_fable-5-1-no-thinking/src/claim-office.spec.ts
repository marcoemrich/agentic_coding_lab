import { describe, it, expect } from "vitest";
import { runScenario, type Item, type Damage, type Result } from "./claim-office.js";

const claim = (items: Item[], damages: Damage[], yearsWithMHPCO = 0): Result => {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "fire", damages } },
    ],
  });
  return results[1];
};

const times = (n: number, type: string): Item[] => Array.from({ length: n }, () => ({ type }));

const quote = (items: Item[], yearsWithMHPCO = 0): number => {
  const { results } = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  return (results[0] as { premium: number }).premium;
};

describe("MHPCO Claim Office", () => {
  describe("quote: base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("single sword (newcomer, first quote) → 100 base + 10 first insurance + 5 fee = 115 G", () => {
      expect(quote([{ type: "sword" }])).toBe(115);
    });
    it("single amulet → 60 base + 6 first insurance + 5 fee = 71 G", () => {
      expect(quote([{ type: "amulet" }])).toBe(71);
    });
    it("single staff → 80 base + 8 first insurance + 5 fee = 93 G", () => {
      expect(quote([{ type: "staff" }])).toBe(93);
    });
    it("single potion → 40 base + 4 first insurance + 5 fee = 49 G", () => {
      expect(quote([{ type: "potion" }])).toBe(49);
    });
    it("2 runes → 50 G base premium (55 + 5 fee = 60 G)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("3 runes → 60 G base premium, block applies (66 + 5 fee = 71 G)", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("4 runes → 100 G base premium, no block (110 + 5 fee = 115 G)", () => {
      expect(quote(times(4, "rune"))).toBe(115);
    });
    it("7 runes → 175 G base premium (192.5 + 5 → rounded up to 198 G)", () => {
      expect(quote(times(7, "rune"))).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G base premium, no block across types (82.5 + 5 → 88 G)", () => {
      expect(quote([...times(2, "rune"), ...times(1, "moonstone")])).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G base premium, two separate blocks (132 + 5 = 137 G)", () => {
      expect(quote([...times(3, "rune"), ...times(3, "moonstone")])).toBe(137);
    });
  });

  describe("quote: premium modifiers", () => {
    it("cursed sword, newcomer → 100 + 50 curse + 10 first insurance + 5 fee = 165 G", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    });
    it("sword with enchantment 5 → high-enchantment surcharge applies (100 + 30 + 10 + 5 = 145 G)", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])).toBe(145);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge (115 G)", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])).toBe(115);
    });
    it("cursed sword with enchantment 5 → both surcharges apply (100 + 50 + 30 + 10 + 5 = 195 G)", () => {
      expect(quote([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])).toBe(195);
    });
    it("customer with exactly 2 years → loyalty discount applies (100 − 20 + 10 + 5 = 95 G)", () => {
      expect(quote([{ type: "sword" }], 2)).toBe(95);
    });
    it("customer with 1 year → no loyalty discount (115 G)", () => {
      expect(quote([{ type: "sword" }], 1)).toBe(115);
    });
    it("second quote in scenario → 15 % follow-up discount (100 + 10 − 15 + 5 = 100 G)", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("cursed sword + plain amulet → curse surcharge on sword only: 160 + 50 = 210, + 16 first insurance + 5 fee = 231 G", () => {
      expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
    });
    it("long-standing customer's second contract, cursed sword enchantment 7 → 160 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
    it("premium yielding 197.5 G is rounded up to 198 G", () => {
      // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5
      expect(quote(times(7, "rune"))).toBe(198);
    });
  });

  describe("claim: standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
      const result = claim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        [{ itemType: "sword", amount: 500 }],
      );
      expect(result).toMatchObject({ payout: 400 });
    });
    it("rune damage 200 G → payout 100 G (no special clause for components)", () => {
      const result = claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]);
      expect(result).toMatchObject({ payout: 100 });
    });
    it("claim result includes remainingCap (sword: cap 2000 − 400 = 1600)", () => {
      const result = claim([{ type: "sword" }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim: special clauses", () => {
    it("steel sword enchantment 9, damage 1000 G → payout 400 G (50 % rule, then deductible)", () => {
      const result = claim(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        [{ itemType: "sword", amount: 1000 }],
      );
      expect(result).toMatchObject({ payout: 400 });
    });
    it("dragon sword enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
      const result = claim(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        [{ itemType: "sword", amount: 800 }],
      );
      expect(result).toMatchObject({ payout: 700 });
    });
    it("dragon sword enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
      const result = claim(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        [{ itemType: "sword", amount: 1000 }],
      );
      expect(result).toMatchObject({ payout: 400 });
    });
    it("dragon sword exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const result = claim(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        [{ itemType: "sword", amount: 1000 }],
      );
      expect(result).toMatchObject({ payout: 400 });
    });
  });

  describe("claim: deductible per damage event", () => {
    it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible once per damaged item)", () => {
      const result = claim(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      );
      expect(result).toMatchObject({ payout: 600 });
    });
    it("two swords insured, two sword damages → each treated separately with its own deductible", () => {
      const result = claim(times(2, "sword"), [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ]);
      expect(result).toEqual({ payout: 600, remainingCap: 3400 });
    });
  });

  describe("claim: cap", () => {
    it("sword + amulet → insurance sum 1600, cap 3200 (remainingCap after 500 damage = 2800)", () => {
      const result = claim([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 2800 });
    });
    it("cursed sword → cap 2000 based on unmodified insurance value", () => {
      const result = claim([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("sword + 3 runes → insurance sum 1750, cap 3500 (block does not affect insurance sum)", () => {
      const result = claim([{ type: "sword" }, ...times(3, "rune")], [{ itemType: "sword", amount: 500 }]);
      expect(result).toEqual({ payout: 400, remainingCap: 3100 });
    });
    it("two swords → insurance sum 2000, cap 4000", () => {
      const result = claim(times(2, "sword"), [{ itemType: "sword", amount: 100 }]);
      expect(result).toEqual({ payout: 0, remainingCap: 4000 });
    });
    it("two successive 1500 G claims on a sword → 1400 (cap 600 left), then 600 (cap 0 left)", () => {
      const dragonAttack = {
        op: "claim" as const,
        policy: 0,
        incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
      };
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, dragonAttack, dragonAttack],
      });
      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("payout yielding 350.5 G is rounded down to 350 G", () => {
      // enchantment 9: 50 % of 901 = 450.5, minus 100 deductible = 350.5
      const result = claim([{ type: "sword", enchantment: 9 }], [{ itemType: "sword", amount: 901 }]);
      expect(result).toMatchObject({ payout: 350 });
    });
  });

  describe("errors", () => {
    it("quote with unknown item type (broomstick) → throws", () => {
      expect(() => quote([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
    it("claim damage for item not in the policy (amulet when only sword insured) → throws", () => {
      expect(() => claim([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(/amulet/);
    });
    it("claim damage with unknown item type → throws", () => {
      expect(() => claim([{ type: "sword" }], [{ itemType: "broomstick", amount: 200 }])).toThrow(/broomstick/);
    });
    it("more sword damages than swords insured → throws", () => {
      expect(() =>
        claim([{ type: "sword" }], [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ]),
      ).toThrow(/sword/);
    });
    it("claim damage with negative amount → throws", () => {
      expect(() => claim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/-200|negative/);
    });
  });
});
