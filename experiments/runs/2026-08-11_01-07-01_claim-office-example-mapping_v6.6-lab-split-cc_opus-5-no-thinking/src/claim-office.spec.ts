import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result.results).toEqual([{ premium: 5 }]);
    });
    it("a single sword → base premium 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("a single amulet → base premium 60 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result.results).toEqual([{ premium: 71 }]);
    });
    it("a single staff → base premium 80 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result.results).toEqual([{ premium: 93 }]);
    });
    it("a single potion → base premium 40 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result.results).toEqual([{ premium: 49 }]);
    });
    it("a single rune → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      expect(result.results).toEqual([{ premium: 33 }]);
    });
    it("a single moonstone → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      expect(result.results).toEqual([{ premium: 33 }]);
    });
    it("a sword and an amulet → policy base premium 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        ],
      });

      expect(result.results).toEqual([{ premium: 181 }]);
    });
  });

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result.results).toEqual([{ premium: 60 }]);
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 71 }]);
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("7 runes → 175 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 198 }]);
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 88 }]);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
              { type: "moonstone" },
              { type: "moonstone" },
            ],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 137 }]);
    });

    it("3 swords → 300 G base premium (no block — the block price is for components)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, { type: "sword" }, { type: "sword" }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 335 }]);
    });
  });

  describe("quote — item-scoped modifiers", () => {
    it("a cursed sword adds a 50 % surcharge on its base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
            ],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 165 }]);
    });
    it("a sword with exactly enchantment 5 adds a 30 % high-enchantment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5 }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 145 }]);
    });
    it("a sword with enchantment 4 gets no high-enchantment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4 }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("a cursed sword with exactly enchantment 5 gets both surcharges", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 5,
                cursed: true,
              },
            ],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 195 }]);
    });
    it("a cursed sword and a plain amulet → 210 G before policy modifiers and fee (curse applies only to the cursed item)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
              { type: "amulet", material: "silver", enchantment: 2 },
            ],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 231 }]);
    });
  });

  describe("quote — policy-scoped modifiers", () => {
    it("a customer with exactly 2 years with MHPCO gets the 20 % loyalty discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result.results).toEqual([{ premium: 95 }]);
    });
    it("a customer with 1 year with MHPCO gets no loyalty discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("the first quote carries the 10 % initial assessment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "staff" }] },
          { op: "quote", items: [{ type: "staff" }] },
        ],
      });

      // 80 base + 8 surcharge + 5 fee = 93. The surcharge is charged on the
      // second quote too — each item is a first insurance regardless of the
      // customer's history — so only the follow-up discount (12) separates them.
      expect(result.results).toEqual([{ premium: 93 }, { premium: 81 }]);
    });
    it("each quote after the first gets an additional 15 % follow-up contract discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });

      expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("the 5 G processing fee is added at the very end", () => {
      // A loyal customer's second quote stacks all three policy modifiers
      // (+10 %, −20 %, −15 %). If the fee were part of the modifier base the
      // net −25 % would bite into it, giving 49 instead of 50.
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [] },
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 5 }, { premium: 50 }]);
    });
  });

  describe("quote — rounding", () => {
    it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
      // 197.5 alone cannot distinguish rounding up from rounding to nearest.
      // A loyal customer's second quote of 7 runes yields 136.25, where
      // rounding in the MHPCO's favour (137) differs from nearest (136).
      const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: sevenRunes },
          { op: "quote", items: sevenRunes },
        ],
      });

      expect(result.results).toEqual([{ premium: 163 }, { premium: 137 }]);
    });
    it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
        ],
      });

      // The second quote's modifiers are 5, −10 and −7.5 on a base of 50. The
      // −7.5 survives unrounded into the total of 42.5, which then rounds once
      // to 43. Rounding that intermediate first would give 42.
      expect(result.results).toEqual([{ premium: 50 }, { premium: 43 }]);
    });
  });

  describe("quote — integration examples", () => {
    it("newcomer (0 years, first contract) with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
            ],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 165 }]);
    });
    it("long-standing customer (3 years), second quote, cursed sword (steel, enchantment 7) → premium 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 7,
                cursed: true,
              },
            ],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 95 }, { premium: 160 }]);
    });
  });

  describe("quote — errors", () => {
    it("an item with an unknown type (e.g. broomstick) → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow();
    });
  });

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
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
      });

      expect(result.results).toEqual([
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("damage to a rune (no enchantment, no material), damage 200 G → payout 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 33 },
        { payout: 100, remainingCap: 400 },
      ]);
    });
  });

  describe("claim — special clauses", () => {
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % clause, then deductible)", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 8 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ]);
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (the 50 % rule wins)", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
  });

  describe("claim — deductible per damage event", () => {
    it("a dragon attack damaging an insured sword (500 G) and an insured amulet (300 G) → payout 600 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, { type: "amulet" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 181 },
        { payout: 600, remainingCap: 2600 },
      ]);
    });
  });

  describe("claim — insurance sum and cap", () => {
    it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });

      // Insurance sum 1000 + 600 = 1600, so the cap is 3200 less the 100 paid.
      expect(result.results).toEqual([
        { premium: 181 },
        { payout: 100, remainingCap: 3100 },
      ]);
    });
    it("a cursed sword (premium with modifiers 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 600 }],
            },
          },
        ],
      });

      // The cap is 2 × the sword's 1000 G insurance value, so 2000 − 500
      // remains. A cap derived from the 165 G premium would leave a
      // different figure entirely.
      expect(result.results).toEqual([
        { premium: 165 },
        { payout: 500, remainingCap: 1500 },
      ]);
    });
    it("a policy covering a sword and 3 runes (a block) → insurance sum 1750 G (block discount affects the premium only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 200 }],
            },
          },
        ],
      });

      // The block discount cuts the premium (runes priced 60 rather than 75)
      // but not the insurance sum: 1000 + 3×250 = 1750, so the cap is 3500.
      expect(result.results).toEqual([
        { premium: 181 },
        { payout: 100, remainingCap: 3400 },
      ]);
    });
    it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      // Both swords count toward the insurance sum: 2 × 1000 = 2000, cap 4000,
      // less the 400 payout.
      expect(result.results).toEqual([
        { premium: 225 },
        { payout: 400, remainingCap: 3600 },
      ]);
    });
  });

  describe("claim — cap exhaustion across successive claims", () => {
    it("sword (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });

      expect(result.results).toEqual([
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
      ]);
    });
    it("sword (cap 2000 G), second claim of 1500 G → payout 600 G, remainingCap 0 G", () => {
      const claimOf1500 = {
        op: "claim" as const,
        policy: 0,
        incident: {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      };
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          claimOf1500,
          claimOf1500,
        ],
      });

      // The second claim wants 1400 but only 600 of cap remains.
      expect(result.results).toEqual([
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("two damages of type sword against a policy covering two swords → each gets its own deductible", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });

      // Two entries of the same type are two separate damages, so the
      // deductible is charged twice: 400 + 200.
      expect(result.results).toEqual([
        { premium: 225 },
        { payout: 600, remainingCap: 3400 },
      ]);
    });
    it("more damage entries of a type than the policy covers → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon attack",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("claim — rounding", () => {
    it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
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
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });

      // 901 × 0.5 = 450.5, less the 100 deductible = 350.5, rounded down.
      expect(result.results).toEqual([
        { premium: 145 },
        { payout: 350, remainingCap: 1650 },
      ]);
    });
  });

  describe("claim — errors", () => {
    it("a damage entry whose item is not part of the policy → error", () => {
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
                damages: [{ itemType: "amulet", amount: 300 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
    it("a damage entry with an unknown item type → error", () => {
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
                damages: [{ itemType: "broomstick", amount: 300 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
    it("a damage entry with amount -200 → error", () => {
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
        }),
      ).toThrow();
    });
  });

  describe("scenario processing", () => {
    it("results are returned in the same order and length as the input steps", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
          {
            op: "claim",
            policy: 1,
            incident: {
              cause: "flood",
              damages: [{ itemType: "amulet", amount: 400 }],
            },
          },
        ],
      });

      // Two quote results then two claim results, each shaped by its own step.
      expect(result.results).toEqual([
        { premium: 115 },
        { premium: 62 },
        { payout: 200, remainingCap: 1800 },
        { payout: 300, remainingCap: 900 },
      ]);
    });
    it("a claim step refers to the policy created by an earlier quote step via its zero-based index", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
          { op: "quote", items: [{ type: "staff" }] },
          {
            op: "claim",
            policy: 2,
            incident: {
              cause: "fire",
              damages: [{ itemType: "staff", amount: 500 }],
            },
          },
        ],
      });

      // The staff policy is named by its STEP index (2), not by its position
      // among the quotes (1) — the intervening claim occupies a step index of
      // its own.
      expect(result.results).toEqual([
        { premium: 115 },
        { payout: 200, remainingCap: 1800 },
        { premium: 81 },
        { payout: 400, remainingCap: 1200 },
      ]);
    });
  });
});
