import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("a single sword → base premium 100 G, premium 115 G (100 + 10 first insurance + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("a single amulet → base premium 60 G, premium 71 G (60 + 6 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("a single staff → base premium 80 G, premium 93 G (80 + 8 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("a single potion → base premium 40 G, premium 49 G (40 + 4 + 5)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("a single rune (component) → base premium 25 G, premium 33 G (25 + 2.5 + 5, rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("a single moonstone (component) → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("building block of 3 alike components", () => {
    it("2 runes → 50 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
        ],
      });

      // 50 base + 5 first insurance + 5 fee = 60
      expect(result).toEqual({ results: [{ premium: 60 }] });
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

      // 60 base (block) + 6 first insurance + 5 fee = 71
      expect(result).toEqual({ results: [{ premium: 71 }] });
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

      // 100 base + 10 first insurance + 5 fee = 115
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → 175 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: Array(7).fill({ type: "rune" }) },
        ],
      });

      // 175 base + 17.5 first insurance + 5 fee = 197.5 → 198 (rounded up)
      expect(result).toEqual({ results: [{ premium: 198 }] });
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

      // 75 base + 7.5 first insurance + 5 fee = 87.5 → 88 (rounded up)
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              ...Array(3).fill({ type: "rune" }),
              ...Array(3).fill({ type: "moonstone" }),
            ],
          },
        ],
      });

      // 60 + 60 = 120 base + 12 first insurance + 5 fee = 137
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("premium modifiers", () => {
    it("cursed sword adds a 50 % risk surcharge of the item's base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });

      // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword with enchantment 5 → high-enchantment surcharge of 30 % applies", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });

      // 100 base + 30 enchantment + 10 first insurance = 140 + 5 fee = 145
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: false },
            ],
          },
        ],
      });

      // 100 base + 10 first insurance = 110 + 5 fee = 115 (no surcharge)
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword with enchantment 5 → both surcharges apply", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      });

      // 100 base + 50 curse + 30 enchantment + 10 first insurance = 190 + 5 = 195
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      // 100 base − 20 loyalty + 10 first insurance = 90 + 5 fee = 95
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("customer with 1 year with MHPCO → no loyalty discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      // 100 base + 10 first insurance = 110 + 5 fee = 115 (no loyalty discount)
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("a first insurance carries a 10 % initial assessment surcharge — even for a long-standing customer", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      // Each item in a quote is treated as a first insurance, regardless of
      // customer history: 100 base − 20 loyalty + 10 first insurance = 90 + 5 = 95
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("the second quote in a scenario receives a 15 % follow-up contract discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });

      // First contract:  100 base + 10 first insurance = 110 + 5 fee = 115
      // Second contract: 100 base + 10 first insurance − 15 follow-up = 95 + 5 = 100
      expect(result).toEqual({
        results: [{ premium: 115 }, { premium: 100 }],
      });
    });
    it("a 5 G processing fee is added to every premium, last — untouched by the percentage modifiers", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      // 100 base − 20 loyalty + 10 first insurance = 90, then + 5 fee = 95.
      // Were the fee folded in before the percentages, the loyalty discount
      // would have eaten into it.
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
  });

  describe("modifier scope on multi-item policies", () => {
    it("cursed sword (100 G) + plain amulet (60 G) → policy base 160 G, curse adds 50 G → 210 G before further modifiers and fee", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet" },
            ],
          },
        ],
      });

      // 160 policy base + 50 curse (50 % of the SWORD's 100, not of the 160
      // policy total) = 210, + 16 first insurance (10 % of 160) = 226, + 5 = 231
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
    it("policy-wide modifiers apply to the sum of all item base premiums, the fee is added last", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet" },
            ],
          },
        ],
      });

      // 160 policy base
      // + 50 curse (item-scoped, on the sword's own 100)
      // − 32 loyalty (20 % of the 160 policy base, NOT of the curse-inflated 210)
      // + 16 first insurance (10 % of 160)
      // = 194, then + 5 fee at the very end = 199
      expect(result).toEqual({ results: [{ premium: 199 }] });
    });
  });

  describe("rounding in the MHPCO's favor", () => {
    it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
      });

      // 175 base + 17.5 first insurance = 192.5 + 5 fee = 197.5 → 198,
      // rounded in the MHPCO's favour
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
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

      // Half of 901 is 450.5; less the 100 deductible that is 350.5, which
      // rounds down in the MHPCO's favour.
      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
      });
    });
    it("intermediate amounts are kept as fractions; only the final amount is rounded", () => {
      const sword = {
        type: "sword",
        material: "steel",
        enchantment: 9,
      };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword, sword] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 301 },
                { itemType: "sword", amount: 301 },
              ],
            },
          },
        ],
      });

      // Each entry reimburses 301/2 − 100 = 50.5. Kept as fractions, the two
      // sum to 101 exactly; rounded per entry they would sum to only 100.
      expect(result).toEqual({
        results: [{ premium: 285 }, { payout: 101, remainingCap: 3899 }],
      });
    });
  });

  describe("claim processing — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
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

      // Full reimbursement minus the 100 G deductible; no special clause applies.
      // Sword insurance value 1000 → cap 2000; 2000 − 400 = 1600 remaining.
      expect(result).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("damage to a rune (value 250 G), damage 200 G → payout 100 G", () => {
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

      // Runes carry no enchantment level and no material, so no special clause
      // applies: 200 − 100 deductible = 100. Value 250 → cap 500, 400 remaining.
      expect(result).toEqual({
        results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
      });
    });
  });

  describe("claim processing — special clauses", () => {
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            ],
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

      // Premium: 100 base + 30 high-enchantment + 10 first insurance + 5 = 145.
      // Payout: enchantment 5 is below the claim threshold of 8, so only the
      // dragon-material clause applies — full 800, then − 100 = 700.
      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
      });
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
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
      });

      // Premium: 100 base + 30 high-enchantment (>= 5) + 10 first insurance + 5 = 145.
      // Payout: the claim threshold is enchantment >= 8, so 50 % of 1000 = 500,
      // then − 100 deductible = 400. Cap 2000 → 1600 remaining.
      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (the 50 % rule wins)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
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

      // Both clauses apply. The 50 % rule wins over dragon material's full
      // reimbursement: 500, then − 100 deductible = 400.
      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 8, cursed: false },
            ],
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

      // Exactly 8 reaches the claim threshold (>= 8, not > 8): 500, then − 100.
      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
  });

  describe("deductible per damage event", () => {
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

      // Premium: 160 policy base + 16 first insurance + 5 fee = 181.
      // Payout: (500 − 100) + (300 − 100) = 600 — the deductible is charged
      // once per damaged item, not once per incident (which would give 700).
      // Insurance sum 1600 → cap 3200, leaving 2600.
      expect(result).toEqual({
        results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
      });
    });
  });

  describe("multiple items of the same type", () => {
    it("a policy covers two swords → insurance sum 2000 G, cap 4000 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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

      // Two swords are not a component block: base premium is a plain
      // 2 × 100 = 200, + 20 first insurance + 5 fee = 225.
      // Insurance sum 2 × 1000 = 2000 → cap 4000; a 100 payout leaves 3900.
      expect(result).toEqual({
        results: [{ premium: 225 }, { payout: 100, remainingCap: 3900 }],
      });
    });
    it("two sword damage entries against a two-sword policy → each treated as a separate damage with its own deductible", () => {
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

      // Two entries of the same type are two separate damages:
      // (500 − 100) + (300 − 100) = 600. Cap 4000 → 3400 remaining.
      expect(result).toEqual({
        results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
      });
    });
    it("more damage entries of a type than insured (two sword damages, one sword insured) → error, non-zero exit", () => {
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
      ).toThrow(/sword/);
    });
  });

  describe("cap exhaustion", () => {
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

      // Insurance sum 1000 + 600 = 1600 → cap 3200. A 100 payout leaves 3100.
      expect(result).toEqual({
        results: [{ premium: 181 }, { payout: 100, remainingCap: 3100 }],
      });
    });
    it("a cursed sword (premium 165 G) → cap 2000 G (based on the unmodified insurance value)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
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

      // The curse raises the premium to 165 but leaves the insurance value at
      // 1000, so the cap stays 2000. A 100 payout leaves 1900.
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

      // Premium: 100 + 60 (block) = 160, +16 first insurance, +5 fee = 181.
      // Insurance sum ignores the block: 1000 + 3×250 = 1750 → cap 3500.
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
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });

      // 1500 − 100 deductible = 1400, still within the 2000 cap.
      expect(result).toEqual({
        results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
      });
    });
    it("sword policy, second claim of 1500 G after the first → payout 600 G, remainingCap 0 G", () => {
      const claim = {
        op: "claim" as const,
        policy: 0,
        incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          claim,
          claim,
        ],
      });

      // The second claim wants 1400 again, but only 600 of the cap is left.
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
  });

  describe("integration examples", () => {
    it("newcomer (0 years, no previous contract) with a cursed steel sword enchantment 3 → premium 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });

      // 100 base + 50 curse + 10 first insurance = 160, + 5 fee = 165.
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("long-standing customer (3 years), second quote, cursed steel sword enchantment 7 → premium 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });

      // First quote: 100 base − 20 loyalty + 10 first insurance = 90, + 5 = 95.
      // Second quote: 100 + 50 curse + 30 enchantment − 20 loyalty
      //   + 10 first insurance − 15 follow-up = 155, + 5 = 160. The first
      //   insurance surcharge applies to the new sword regardless of history.
      expect(result).toEqual({
        results: [{ premium: 95 }, { premium: 160 }],
      });
    });
  });

  describe("error cases", () => {
    it("quote includes an item with an unknown type (broomstick) → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow(/broomstick/);
    });
    it("claim references a damage entry whose item is not part of the policy (amulet damaged, only sword insured) → error", () => {
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
        }),
      ).toThrow(/amulet/);
    });
    it("claim references a damage entry with an unknown item type → error", () => {
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
                damages: [{ itemType: "broomstick", amount: 200 }],
              },
            },
          ],
        }),
      ).toThrow(/broomstick/);
    });
    it("claim contains a damage entry with amount: -200 → error", () => {
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
      ).toThrow(/-200/);
    });
  });

  describe("CLI", () => {
    // Run the real entry point as a subprocess, so the stdin/stdout/exit-code
    // contract the spec fixes is exercised rather than simulated.
    const runCli = (stdin: string) =>
      spawnSync("node_modules/.bin/tsx", ["src/cli.ts"], {
        input: stdin,
        encoding: "utf8",
      });

    it("reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
      const cli = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            { op: "quote", items: [{ type: "amulet" }] },
          ],
        }),
      );

      // 100 + 10 first insurance + 5 fee = 115; then
      // 60 + 6 first insurance − 9 follow-up + 5 fee = 62.
      expect(cli.status).toBe(0);
      expect(JSON.parse(cli.stdout)).toEqual({
        results: [{ premium: 115 }, { premium: 62 }],
      });
    });
    it("the schema example scenario yields a premium result and a payout/remainingCap result", () => {
      const cli = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 5 },
          steps: [
            {
              op: "quote",
              items: [
                {
                  type: "amulet",
                  material: "silver",
                  enchantment: 2,
                  cursed: false,
                },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        }),
      );

      // Quote: 60 base − 12 loyalty + 6 first insurance = 54, + 5 fee = 59.
      // Claim: cap 2 × 600 = 1200; enchantment 2 < 8 so full 200, − 100
      //   deductible = 100; remaining cap 1200 − 100 = 1100.
      expect(cli.status).toBe(0);
      expect(JSON.parse(cli.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("an invalid scenario exits with a non-zero status code, writes to stderr and no results to stdout", () => {
      const cli = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      );

      expect(cli.status).not.toBe(0);
      expect(cli.stderr).toMatch(/broomstick/);
      expect(cli.stdout).not.toContain("results");
      // An error DESCRIPTION, not a crash: an unhandled throw would also exit
      // non-zero and name the item, but only by dumping a stack trace.
      expect(cli.stderr).not.toMatch(/\n\s+at /);
    });
  });
});
