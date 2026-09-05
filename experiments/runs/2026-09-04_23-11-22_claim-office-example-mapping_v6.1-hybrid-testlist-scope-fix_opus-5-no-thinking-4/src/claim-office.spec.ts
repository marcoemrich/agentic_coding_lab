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
    it("a single sword → base premium 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("a single amulet → base premium 60 G + 6 G first insurance + 5 G fee = 71 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result.results).toEqual([{ premium: 71 }]);
    });
    it("a single staff → base premium 80 G + 8 G first insurance + 5 G fee = 93 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result.results).toEqual([{ premium: 93 }]);
    });
    it("a single potion → base premium 40 G + 4 G first insurance + 5 G fee = 49 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result.results).toEqual([{ premium: 49 }]);
    });
    it("a single rune → base premium 25 G + 2.5 G first insurance + 5 G fee = 33 G (rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      expect(result.results).toEqual([{ premium: 33 }]);
    });
    it("a single moonstone → base premium 25 G + 2.5 G first insurance + 5 G fee = 33 G (rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      expect(result.results).toEqual([{ premium: 33 }]);
    });
  });

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      // 50 G base + 5 G first insurance + 5 G fee
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

      // 60 G block base + 6 G first insurance + 5 G fee
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

      // 100 G base + 10 G first insurance + 5 G fee
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

      // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 → 198
      expect(result.results).toEqual([{ premium: 198 }]);
    });
  });

  describe("quote — 'alike' components means same type", () => {
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

      // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 → 88
      expect(result.results).toEqual([{ premium: 88 }]);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              ...Array.from({ length: 3 }, () => ({ type: "rune" })),
              ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
            ],
          },
        ],
      });

      // 120 G base + 12 G first insurance + 5 G fee
      expect(result.results).toEqual([{ premium: 137 }]);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("cursed sword adds a 50 % surcharge on the item's base premium (50 G) → 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });

      // 100 G base + 50 G curse + 10 G first insurance (10 % of base) + 5 G fee
      // matches the spec's "Newcomer with a cursed sword" integration example
      expect(result.results).toEqual([{ premium: 165 }]);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies → 145 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5 }],
          },
        ],
      });

      // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
      expect(result.results).toEqual([{ premium: 145 }]);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge → 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4 }],
          },
        ],
      });

      // 100 G base + 10 G first insurance + 5 G fee
      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("cursed sword with exactly enchantment 5 → both surcharges apply → 195 G", () => {
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

      // 100 G base + 50 G curse + 30 G high enchantment
      // + 10 G first insurance (10 % of base) + 5 G fee
      expect(result.results).toEqual([{ premium: 195 }]);
    });
  });

  describe("quote — modifier scope on multi-item policies", () => {
    it("cursed sword + plain amulet → curse adds 50 G (50 % of the sword only), 210 G before further modifiers and fee", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet", material: "silver", enchantment: 2 },
            ],
          },
        ],
      });

      // policy base 160 (100 + 60) + 50 curse (sword only) = 210
      // + 16 first insurance (10 % of the 160 base) + 5 fee
      expect(result.results).toEqual([{ premium: 231 }]);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
        ],
      });

      // 100 G base − 20 G loyalty + 10 G first insurance + 5 G fee
      expect(result.results).toEqual([{ premium: 95 }]);
    });
    it("customer with 1 year with MHPCO → no loyalty discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
        ],
      });

      // 100 G base + 10 G first insurance + 5 G fee
      expect(result.results).toEqual([{ premium: 115 }]);
    });
    // "a first insurance carries a 10 % initial assessment surcharge on the
    // policy base premium" — covered by every quote test above: each includes
    // the surcharge, e.g. the single sword at 100 + 10 + 5 = 115 G.
    it("each contract after the customer's first gets a 15 % discount", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3 };
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      });

      // first contract: 100 + 10 first insurance + 5 fee
      // second contract: 100 + 10 first insurance − 15 follow-up + 5 fee
      expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    // "a 5 G processing fee is added to every premium" — covered by every
    // quote test, most directly by the empty item list yielding exactly 5 G.
  });

  describe("quote — rounding in the MHPCO's favor", () => {
    // "a premium calculation that yields 197.5 G → final premium 198 G" —
    // covered by the 7-rune test above, which computes exactly 197.5 → 198.
    it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
              { type: "rune" },
            ],
          },
        ],
      });

      // base 85 = 60 (moonstone block) + 25 (rune)
      // net policy rate −10 % (10 % first insurance − 20 % loyalty) = −8.5
      // 85 − 8.5 + 5 fee = 81.5 → 82. Rounding the −8.5 to −9 first would
      // have given 81, so this pins that intermediates stay fractional.
      expect(result.results).toEqual([{ premium: 82 }]);
    });
  });

  describe("quote — integration examples", () => {
    // "newcomer (0 years) with a cursed steel sword enchantment 3 → 165 G" —
    // covered by the cursed-sword surcharge test, which asserts exactly this
    // scenario, and again by the cap test that pairs 165 G with a claim.
    it("long-standing customer (3 years), second quote, cursed steel sword enchantment 7 → premium 160 G", () => {
      const cursedSword = {
        type: "sword",
        material: "steel",
        enchantment: 7,
        cursed: true,
      };
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          { op: "quote", items: [cursedSword] },
        ],
      });

      // 100 base + 50 curse + 30 high enchantment − 20 loyalty
      // + 10 first insurance − 15 follow-up contract + 5 fee
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote — errors", () => {
    it("an item with an unknown type (e.g. broomstick) → error", () => {
      const runUnknownItemType = () =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        });

      // a deliberate rejection naming the type, not an incidental TypeError
      expect(runUnknownItemType).toThrow(/broomstick/);
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

      // full reimbursement minus the 100 G deductible; cap 2000 − 400 paid
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G", () => {
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

      // runes have no enchantment or material, so no special clause applies
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("claim — damage below the deductible", () => {
    it("damage below the deductible pays nothing rather than a negative amount", () => {
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
              damages: [{ itemType: "sword", amount: 50 }],
            },
          },
        ],
      });

      // 50 − 100 would be −50: the claimant never owes the MHPCO, and the cap
      // is a ceiling on payouts, so it cannot grow above its initial 2000.
      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
    });
  });

  describe("claim — special clauses", () => {
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (dragon: full, then deductible)", () => {
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

      // enchantment 5 < 8, so only the dragon clause applies: full, then deductible
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
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
      });

      // 50 % of 1000 = 500, then the 100 G deductible
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins, then deductible)", () => {
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

      // both clauses apply; the 50 % rule wins, then the deductible
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
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

      // exactly 8 meets the threshold: 50 % clause applies, then the deductible
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim — deductible per damage event", () => {
    it("a dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              { type: "amulet", material: "silver", enchantment: 2 },
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

      // (500 − 100) + (300 − 100); insurance sum 1600, cap 3200
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim — insurance sum and cap", () => {
    it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              { type: "amulet", material: "silver", enchantment: 2 },
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

      // cap 3200 = 2 × (1000 + 600), less the 100 G payout
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
    });
    it("a cursed sword (premium with modifiers 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
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

      // the premium carries the curse surcharge, but the cap stays at
      // 2 × the unmodified insurance value of 1000
      expect(result.results).toEqual([
        { premium: 165 },
        { payout: 100, remainingCap: 1900 },
      ]);
    });
    it("a policy covering a sword and 3 runes → insurance sum 1750 G, cap 3500 G (block discount affects the premium only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              ...Array.from({ length: 3 }, () => ({ type: "rune" })),
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

      // cap 3500 = 2 × (1000 + 3×250); the block discount touches only the premium
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              { type: "sword", material: "steel", enchantment: 3 },
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

      // cap 4000 = 2 × (2 × 1000)
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3900 });
    });
  });

  describe("claim — cap exhaustion across successive claims", () => {
    it("sword (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
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
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
          claimOf1500,
        ],
      });

      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
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
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
          claimOf1500,
          claimOf1500,
        ],
      });

      // the desired 1400 is reduced to the remaining cap of 600
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("two swords insured, both damaged → each damage entry gets its own deductible", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              { type: "sword", material: "steel", enchantment: 9 },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 1000 },
                { itemType: "sword", amount: 1000 },
              ],
            },
          },
        ],
      });

      // each entry matches a distinct insured sword: (1000 − 100) for the
      // plain one, (500 − 100) for the enchantment-9 one; cap 4000
      expect(result.results[1]).toEqual({ payout: 1300, remainingCap: 2700 });
    });
    it("more damage entries of a type than the policy covers (two sword damages, one sword insured) → error", () => {
      const runTwoSwordDamages = () =>
        runScenario({
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
                cause: "dragon attack",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 500 },
                ],
              },
            },
          ],
        });

      // a deliberate rejection, not an incidental TypeError
      expect(runTwoSwordDamages).toThrow(/sword/);
    });
  });

  describe("claim — rounding in the MHPCO's favor", () => {
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

      // 901 / 2 = 450.5, less the 100 G deductible = 350.5 → 350
      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim — errors", () => {
    it("a damage entry whose item is not part of the policy (amulet damaged, only a sword insured) → error", () => {
      const runUninsuredAmuletDamage = () =>
        runScenario({
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
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        });

      expect(runUninsuredAmuletDamage).toThrow(/amulet/);
    });
    it("a damage entry with an unknown item type → error", () => {
      const runUnknownDamageType = () =>
        runScenario({
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
                damages: [{ itemType: "broomstick", amount: 200 }],
              },
            },
          ],
        });

      expect(runUnknownDamageType).toThrow(/broomstick/);
    });
    it("a damage entry with amount -200 → error", () => {
      const runNegativeDamage = () =>
        runScenario({
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
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        });

      expect(runNegativeDamage).toThrow(/-200|negative/);
    });
  });

  describe("scenario processing", () => {
    it("results array has the same length and order as the input steps", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2 }],
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

      // second quote is a follow-up contract: 60 − 9 + 6 + 5 = 62
      expect(result.results).toEqual([
        { premium: 115 },
        { premium: 62 },
        { payout: 100, remainingCap: 1900 },
      ]);
    });
    it("a claim step refers to the policy created by an earlier quote step via its zero-based step index", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2 }],
          },
          {
            op: "claim",
            policy: 1,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      });

      // policy 1 is the amulet: cap 1200 = 2 × 600, less the 200 G payout
      expect(result.results[2]).toEqual({ payout: 200, remainingCap: 1000 });
    });
  });
});
