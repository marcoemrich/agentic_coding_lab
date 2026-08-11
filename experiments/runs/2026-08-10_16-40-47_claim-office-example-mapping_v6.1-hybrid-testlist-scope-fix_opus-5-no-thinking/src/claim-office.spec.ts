import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("a single sword → base premium 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      // 100 base + 10 first insurance + 5 fee
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("a single amulet → base premium 60 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      // 60 base + 6 first insurance + 5 fee
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("a single staff → base premium 80 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      // 80 base + 8 first insurance + 5 fee
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("a single potion → base premium 40 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      // 40 base + 4 first insurance + 5 fee
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("a single rune (component) → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      // 25 base + 2.5 first insurance + 5 fee = 32.5, rounded up in MHPCO's favour
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("a single moonstone (component) → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      // 25 base + 2.5 first insurance + 5 fee = 32.5, rounded up
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("a sword and an amulet → policy base premium 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }],
      });

      // (100 + 60) base + 16 first insurance + 5 fee
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
  });

  describe("quote — component blocks", () => {
    it("2 runes → 50 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      // 50 base + 5 first insurance + 5 fee
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });

      // 60 block base + 6 first insurance + 5 fee
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      // 100 base + 10 first insurance + 5 fee
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → 175 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
      });

      // 175 base (no block: the block applies only to exactly 3)
      // + 17.5 first insurance + 5 fee = 197.5, rounded up
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
        ],
      });

      // 75 base (no block: "alike" means the same type) + 7.5 + 5 = 87.5, rounded up
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })],
          },
        ],
      });

      // two blocks of 60 = 120 base + 12 first insurance + 5 fee
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote — item-level modifiers", () => {
    it("cursed sword → 50 % risk surcharge on the item's base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });

      // 100 base + 50 curse + 10 first insurance = 160 + 5 fee
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword with exactly enchantment 5 → 30 % high-enchantment surcharge applies", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });

      // 100 base + 30 high enchantment + 10 first insurance = 140 + 5 fee
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      });

      // 100 base + 10 first insurance + 5 fee (below the level-5 threshold)
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword with exactly enchantment 5 → both surcharges apply", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });

      // 100 base + 50 curse + 30 high enchantment + 10 first insurance = 190 + 5 fee
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("cursed sword (100 G) plus plain amulet (60 G) → curse adds 50 G (50 % of the cursed item only), 210 G before further modifiers and fee", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });

      // policy base 160; curse adds 50 (50 % of the sword's 100, not of 160) → 210
      // first insurance is 10 % of the policy base 160 = 16 → 226, + 5 fee
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("quote — policy-level modifiers", () => {
    it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      // 100 base - 20 loyalty + 10 first insurance = 90, + 5 fee
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("customer with 1 year with MHPCO → no loyalty discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      // 100 base + 10 first insurance + 5 fee (below the 2-year threshold)
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("first insurance → 10 % initial assessment surcharge on the policy base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      // 80 policy base + 8 (10 % of 80) + 5 fee
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("each contract after the first → 15 % follow-up discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 115 }, // 100 + 10 first insurance + 5 fee
          { premium: 100 }, // 100 - 15 follow-up + 10 first insurance + 5 fee
        ],
      });
    });
    it("the 5 G processing fee is added at the very end of every premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      // 40 base + 4 first insurance = 44, then the flat fee: 49.
      // The fee is added after the modifiers, so it is never scaled by them —
      // 10 % of (40 + 5) would have given 49.5 → 50.
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
  });

  describe("quote — rounding in the MHPCO's favor", () => {
    it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
      });

      // 175 + 17.5 + 5 = 197.5 exactly; the MHPCO rounds premiums up
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "rune", cursed: true }] }],
      });

      // 25 base + 12.5 curse - 5 loyalty + 2.5 first insurance + 5 fee = 40 exactly.
      // Rounding each fractional addend up as it is computed would give 41.
      expect(result).toEqual({ results: [{ premium: 40 }] });
    });
  });

  describe("quote — integration examples", () => {
    it("newcomer (0 years, no previous contract) with a cursed sword → premium 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });

      // 100 base + 50 curse + 10 first insurance = 160 + 5 fee
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("long-standing customer (3 years), second quote, cursed sword with enchantment 7 → premium 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 95 }, // 100 base - 20 loyalty + 10 first insurance + 5 fee
          // 100 base + 50 curse + 30 high ench - 20 loyalty
          //   + 10 first insurance - 15 follow-up = 155, + 5 fee
          { premium: 160 },
        ],
      });
    });
  });

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 115 },
          // full reimbursement minus the 100 G deductible; cap 2000 - 400 paid
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 33 },
          // runes have no enchantment or material, so no special clause applies;
          // 200 - 100 deductible. Cap 2 x 250 = 500.
          { payout: 100, remainingCap: 400 },
        ],
      });
    });
  });

  describe("claim — special clauses", () => {
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 145 }, // 100 + 30 high ench + 10 first insurance + 5 fee
          // enchantment >= 8 → 50 % of 1000 = 500, then the deductible
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 145 },
          // only the dragon-material clause applies (enchantment 5 < 8):
          // full reimbursement 800, then the deductible
          { payout: 700, remainingCap: 1300 },
        ],
      });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (the 50 % rule wins)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 145 },
          // both clauses apply; the 50 % rule wins, then the deductible
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (threshold is ≥ 8)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 145 },
          // exactly 8 still triggers the half-reimbursement clause, then the deductible
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
  });

  describe("claim — deductible per damage event", () => {
    it("a dragon attack damages an insured sword (500 G) and an insured amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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

      expect(result).toEqual({
        results: [
          { premium: 181 },
          // (500 - 100) + (300 - 100); cap 2 x (1000 + 600) = 3200
          { payout: 600, remainingCap: 2600 },
        ],
      });
    });
  });

  describe("claim — rounding in the MHPCO's favor", () => {
    it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 145 },
          // 50 % of 901 = 450.5, minus the deductible = 350.5;
          // payouts are rounded down in the MHPCO's favour
          { payout: 350, remainingCap: 1650 },
        ],
      });
    });
  });

  describe("claim — cap", () => {
    it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });

      // insurance sum 1000 + 600 = 1600, cap 3200; 3200 - 100 paid
      expect(result).toEqual({
        results: [{ premium: 181 }, { payout: 100, remainingCap: 3100 }],
      });
    });
    it("a cursed sword (premium with modifiers 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });

      // the cap follows the unmodified insurance value (2 x 1000), not the 165 premium
      expect(result).toEqual({
        results: [{ premium: 165 }, { payout: 100, remainingCap: 1900 }],
      });
    });
    it("a policy covering a sword and 3 runes (a block) → insurance sum 1750 G (block discount affects the premium only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, ...Array(3).fill({ type: "rune" })],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });

      // premium base 100 + 60 (block) = 160, + 16 + 5 = 181
      // insurance sum 1000 + 3 x 250 = 1750 (undiscounted), cap 3500
      expect(result).toEqual({
        results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }],
      });
    });
    it("sword policy (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });

      // 1500 - 100 deductible = 1400, within the 2000 cap
      expect(result).toEqual({
        results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
      });
    });
    it("sword policy, second successive claim of 1500 G → payout 600 G, remainingCap 0 G (reduced to the remaining cap)", () => {
      const claimOf1500 = {
        op: "claim" as const,
        policy: 0,
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }, claimOf1500, claimOf1500],
      });

      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          // the desired 1400 is reduced to the 600 that remains of the cap
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });

      // premium 200 base + 20 + 5 = 225; insurance sum 2 x 1000, cap 4000
      expect(result).toEqual({
        results: [{ premium: 225 }, { payout: 100, remainingCap: 3900 }],
      });
    });
    it("two sword damage entries against a policy with two swords → each is a separate damage with its own deductible", () => {
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

      // (500 - 100) + (300 - 100) = 600; cap 4000
      expect(result).toEqual({
        results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
      });
    });
    it("more damage entries of a type than the policy covers (two sword damages, one sword insured) → error", () => {
      const runOverClaimedScenario = () =>
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
                  { itemType: "sword", amount: 200 },
                  { itemType: "sword", amount: 200 },
                ],
              },
            },
          ],
        });

      expect(runOverClaimedScenario).toThrow();
    });
  });

  describe("error cases", () => {
    it("quote includes an item with an unknown type (broomstick) → error", () => {
      const runUnknownItemTypeScenario = () =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        });

      expect(runUnknownItemTypeScenario).toThrow();
    });
    it("claim damages an amulet when only a sword is insured → error", () => {
      const runUninsuredItemScenario = () =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
            },
          ],
        });

      expect(runUninsuredItemScenario).toThrow();
    });
    it("claim references a damage entry with an unknown item type → error", () => {
      const runUnknownDamageTypeScenario = () =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
            },
          ],
        });

      expect(runUnknownDamageTypeScenario).toThrow();
    });
    it("claim contains a damage entry with amount -200 → error", () => {
      const runNegativeDamageScenario = () =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
            },
          ],
        });

      expect(runNegativeDamageScenario).toThrow();
    });
  });

  describe("scenario processing", () => {
    it("results array has the same length and order as the input steps", () => {
      const steps = [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "quote" as const, items: [{ type: "amulet" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ];

      const { results } = runScenario({ customer: { yearsWithMHPCO: 0 }, steps });

      expect(results).toHaveLength(steps.length);
      expect(results).toEqual([
        { premium: 115 }, // 100 + 10 first insurance + 5 fee
        { premium: 62 }, // 60 + 6 first insurance - 9 follow-up + 5 fee
        { payout: 100, remainingCap: 1900 }, // against the sword policy at step 0
      ]);
    });
    it("a claim step refers to the policy created by an earlier quote step via its zero-based step index", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "claim",
            policy: 1,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
          },
        ],
      });

      // the claim resolves policy 1 (the amulet): cap 2 x 600 = 1200, payout 300 - 100.
      // Resolving policy 0 instead would reject the claim — no amulet is insured there.
      expect(result).toEqual({
        results: [{ premium: 115 }, { premium: 62 }, { payout: 200, remainingCap: 1000 }],
      });
    });
  });

  // The CLI is covered by src/cli.spec.ts, which drives the real executable.
});
