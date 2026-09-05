import { describe, it, expect } from "vitest";
import { runScenario, type Scenario, type Step } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (processing fee only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("a single sword → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("a single amulet → base premium 60 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("a single staff → base premium 80 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("a single potion → base premium 40 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("a single rune (component) → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      // 25 base + 2.5 first insurance + 5 fee = 32.5 → 33 (rounded in MHPCO's favor)
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

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
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

      // 60 block base + 6 first insurance + 5 fee = 71
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }],
      });

      // 100 base + 10 first insurance + 5 fee = 115
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → 175 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
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

      // 120 base + 12 first insurance + 5 fee = 137
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote — premium modifiers", () => {
    it("cursed sword adds a 50 % risk surcharge on the item's base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });

      // 100 base + 50 curse + 10 first insurance + 5 fee = 165
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword with enchantment 5 adds a 30 % high-enchantment surcharge (threshold inclusive)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });

      // 100 base + 30 high enchantment + 10 first insurance + 5 fee = 145
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword with enchantment 4 gets no high-enchantment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      });

      // 100 base + 10 first insurance + 5 fee = 115
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword with enchantment 5 gets both surcharges", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });

      // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee = 195
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("customer with exactly 2 years with MHPCO receives the 20 % loyalty discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });

      // 100 base - 20 loyalty + 10 first insurance + 5 fee = 95
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("customer with 1 year with MHPCO receives no loyalty discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });

      // 100 base + 10 first insurance + 5 fee = 115
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("every item in a quote carries the 10 % first insurance surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, { type: "amulet" }],
          },
        ],
      });

      // 160 base + 16 first insurance + 5 fee = 181
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
    it("the customer's second quote receives an additional 15 % follow-up contract discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });

      // first:  100 base + 10 first insurance + 5 fee = 115
      // second: 100 base + 10 first insurance - 15 follow-up + 5 fee = 100
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
  });

  describe("quote — modifier scope on multi-item policies", () => {
    it("cursed sword + plain amulet → 210 G before further modifiers and fee (curse applies to the cursed item's base premium only)", () => {
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

      // 160 policy base + 50 curse (50% of the SWORD's 100, not of 160) = 210
      // + 16 first insurance (10% of 160) + 5 fee = 231
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
    it("policy-wide modifiers apply to the sum of all item base premiums", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
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

      // 160 policy base + 50 curse + 16 first insurance (10% of 160)
      // - 32 loyalty (20% of 160, NOT of the curse-inflated 210) + 5 fee = 199
      expect(result).toEqual({ results: [{ premium: 199 }] });
    });
  });

  describe("quote — rounding in the MHPCO's favor", () => {
    it("a premium calculation yielding 197.5 G → final premium 198 G (rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
      });

      // 175 base + 17.5 first insurance + 5 fee = 197.5 exactly → 198
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      // Both intermediates are fractional: +2.5 first insurance, -5 loyalty.
      // Kept as fractions: 25 + 2.5 - 5 + 5 = 27.5 → 28.
      // Rounding each intermediate up first would give 25 + 3 - 5 + 5 = 28 too,
      // but rounding the SUBTOTAL before the fee (22.5 → 23) would give 28 as
      // well — so the discriminator is that no intermediate is truncated down:
      // a floor-at-each-step implementation yields 25 + 2 - 5 + 5 = 27.
      expect(result).toEqual({ results: [{ premium: 28 }] });
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

      // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("long-standing customer (3 years), second quote, cursed sword enchantment 7 → premium 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });

      // Second quote: 100 base + 50 curse + 30 high enchantment - 20 loyalty
      // + 10 first insurance - 15 follow-up = 155 + 5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
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

      // 500 damage - 100 deductible = 400; cap 2000 - 400 = 1600 remaining
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (no enchantment, no material), damage 200 G → payout 100 G", () => {
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

      // 200 damage - 100 deductible = 100; rune insurance 250 → cap 500
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("damage below the deductible → payout 0 G", () => {
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
            incident: { cause: "scratch", damages: [{ itemType: "sword", amount: 60 }] },
          },
        ],
      });

      // 60 damage - 100 deductible would be negative; the payout floors at 0
      // (the office does not bill the customer) and the cap is untouched.
      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
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

      // high enchantment (>= 8): 1000 * 50% = 500, then - 100 deductible = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full then deductible)", () => {
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

      // enchantment 5 < 8, so only the dragon clause applies: 800 - 100 = 700
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
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

      // both clauses apply; the 50 % rule wins: 1000 * 50% = 500, - 100 = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 8, damage 1000 G → payout 400 G (threshold inclusive)", () => {
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

      // enchantment exactly 8 → high-enchantment clause applies, then deductible
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim — deductible per damage event", () => {
    it("dragon attack damaging a sword (500 G) and an amulet (300 G) → payout 600 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
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

      // the 100 G deductible applies once per damaged item:
      // (500 - 100) + (300 - 100) = 600; insurance sum 1600 → cap 3200
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });

      // insurance sum 2 x 1000 = 2000 → cap 4000; payout 500 - 100 = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
    });
    it("two sword damage entries against two insured swords → each gets its own deductible", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 400 },
              ],
            },
          },
        ],
      });

      // each entry is a separate damage with its own deductible:
      // (500 - 100) + (400 - 100) = 700; cap 4000 → 3300 remaining
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 3300 });
    });
    it("more damage entries of a type than the policy covers → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 400 },
              ],
            },
          },
        ],
      };

      // only one sword is insured, but two sword damages are claimed
      expect(() => runScenario(scenario)).toThrow();
    });
  });

  describe("claim — cap", () => {
    it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });

      // insurance sum 1000 + 600 = 1600 → cap 3200; payout 100 leaves 3100
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
    });
    it("a cursed sword → cap 2000 G (premium modifiers do not raise the cap)", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2500 }] },
          },
        ],
      });

      // premium is 165 G with the curse surcharge, but the cap is based on the
      // unmodified insurance value: 2 x 1000 = 2000, so 2400 desired → 2000
      expect(result.results[0]).toEqual({ premium: 165 });
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("a policy covering a sword and 3 runes → insurance sum 1750 G (block discount does not affect the sum)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ...Array(3).fill({ type: "rune" }),
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] },
          },
        ],
      });

      // premium: 100 sword + 60 rune block = 160 base + 16 first + 5 fee = 181
      // insurance sum 1000 + 3 x 250 = 1750 (block affects the premium only)
      // → cap 3500, so the desired 4900 is reduced to 3500
      expect(result.results[0]).toEqual({ premium: 181 });
      expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
    });
    it("sword policy (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });

      // 1500 - 100 = 1400, within the 2000 cap → 600 remaining
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("sword policy, second claim of 1500 G → payout 600 G, remainingCap 0 G (reduced to remaining cap)", () => {
      const claimStep: Step = {
        op: "claim",
        policy: 0,
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      };
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          claimStep,
          claimStep,
        ],
      });

      // first claim consumes 1400 of the 2000 cap, leaving 600; the second
      // claim's desired 1400 is reduced to the remaining 600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("claim — rounding in the MHPCO's favor", () => {
    it("a payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
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

      // 901 * 50% = 450.5, - 100 deductible = 350.5 → 350 (rounded down)
      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("errors", () => {
    it("quote with an item of unknown type (e.g. broomstick) → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };

      expect(() => runScenario(scenario)).toThrow();
    });
    it("claim referencing an item that is not part of the policy → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      };

      // an amulet is damaged, but only a sword is insured
      expect(() => runScenario(scenario)).toThrow();
    });
    it("claim referencing a damage item with an unknown type → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      };

      expect(() => runScenario(scenario)).toThrow();
    });
    it("claim with a damage entry of amount -200 → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      };

      expect(() => runScenario(scenario)).toThrow();
    });
  });

  describe("scenario processing", () => {
    it("results array has the same length and order as the input steps", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
          { op: "quote", items: [{ type: "amulet" }] },
        ],
      });

      expect(result.results).toHaveLength(3);
      expect(result.results).toEqual([
        { premium: 115 },
        { payout: 200, remainingCap: 1800 },
        // second quote → follow-up discount: 60 base + 6 first - 9 follow-up + 5 = 62
        { premium: 62 },
      ]);
    });
    it("a claim step refers to the policy created by an earlier quote step via its zero-based index", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "staff" }] },
          {
            op: "claim",
            policy: 2,
            incident: { cause: "fire", damages: [{ itemType: "staff", amount: 400 }] },
          },
        ],
      });

      // policy 2 is the staff (insurance 800 → cap 1600), not the sword at 0
      expect(result.results[3]).toEqual({ payout: 300, remainingCap: 1300 });
    });
  });
});
