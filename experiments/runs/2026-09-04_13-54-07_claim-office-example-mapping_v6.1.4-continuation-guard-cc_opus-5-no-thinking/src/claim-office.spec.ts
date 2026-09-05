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
    it("a single sword → base premium 100 G (+10 % first insurance +5 G fee = 115 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("a single amulet → base premium 60 G (+10 % first insurance +5 G fee = 71 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("a single staff → base premium 80 G (+10 % first insurance +5 G fee = 93 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("a single potion → base premium 40 G (+10 % first insurance +5 G fee = 49 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("a single rune (component) → base premium 25 G (32.5 G rounded up to 33 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("a single moonstone (component) → base premium 25 G (32.5 G rounded up to 33 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("a sword and an amulet → policy base premium 160 G (+16 first insurance +5 G fee = 181 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
  });

  describe("quote — component blocks", () => {
    it("2 runes → 50 G base premium (no block; +5 first insurance +5 G fee = 60 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes → 60 G base premium (block applies; +6 first insurance +5 G fee = 71 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3; total 115 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → 175 G base premium (no block; 197.5 G rounded up to 198 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types; total 88 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks; total 137 G)", () => {
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

      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote — item-scoped modifiers", () => {
    it("a cursed sword adds a 50 % risk surcharge → 100 + 50 G (+10 first insurance +5 G fee = 165 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("a sword with enchantment 5 adds a 30 % surcharge → 100 + 30 G (+10 first insurance +5 G fee = 145 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("a sword with enchantment 4 gets no high-enchantment surcharge (total 115 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("a cursed sword with enchantment 5 gets both surcharges → 100 + 50 + 30 G (total 195 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("cursed surcharge applies to the cursed item only: cursed sword + plain amulet → 160 base + 50 curse = 210 G before further modifiers (total 231 G)", () => {
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

      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("quote — policy-scoped modifiers", () => {
    it("a customer with exactly 2 years with MHPCO receives the 20 % loyalty discount (total 95 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("a customer with 1 year with MHPCO receives no loyalty discount (total 115 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("a first insurance carries a 10 % initial assessment surcharge — staff 80 G + 8 G (total 93 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff", material: "oak", enchantment: 2, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("the second contract in a scenario receives a 15 % follow-up discount (115 G then 100 G)", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("the first insurance surcharge still applies on a follow-up contract (second contract 160 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
    });
    it("a 5 G processing fee is added to every premium — potion 44 G before fee → 49 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
  });

  describe("quote — rounding in the MHPCO's favour", () => {
    // "197.5 G → 198 G" is covered by the 7-runes test above.
    it("intermediate amounts are kept as fractions; only the final premium is rounded — cursed rune → 45 G, not 46 G", () => {
      // 25 base + 12.5 curse + 2.5 first insurance + 5 fee = 45 exactly.
      // Rounding each modifier up as it is applied would instead give 46.
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune", cursed: true }] }],
      });

      expect(result).toEqual({ results: [{ premium: 45 }] });
    });
  });

  // The spec's two integration examples are covered above: the newcomer with a
  // cursed sword (165 G) and the long-standing customer's second contract (160 G).

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
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("damage to a rune (no enchantment, no material), damage 200 G → payout 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "flood", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
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
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
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

      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
      });
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

      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G", () => {
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
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
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
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
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
      });

      expect(result).toEqual({
        results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
      });
    });
    it("a damage amount below the deductible does not produce a negative payout", () => {
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
            incident: { cause: "scratch", damages: [{ itemType: "sword", amount: 40 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 115 }, { payout: 0, remainingCap: 2000 }],
      });
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
        ],
      });

      // 3200 cap − 200 payout = 3000 confirms the cap started at 2 × 1600.
      expect(result).toEqual({
        results: [{ premium: 181 }, { payout: 200, remainingCap: 3000 }],
      });
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
        ],
      });

      // The 165 G premium includes the curse surcharge; the cap is still
      // 2 × the unmodified 1000 G insurance value.
      expect(result).toEqual({
        results: [{ premium: 165 }, { payout: 200, remainingCap: 1800 }],
      });
    });
    it("a policy covering a sword and 3 runes → insurance sum 1750 G (block affects premium only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ...Array.from({ length: 3 }, () => ({ type: "rune" })),
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
        ],
      });

      // The runes are premium-discounted as a block (60 G) but insured at
      // 3 × 250 G, so the cap is 2 × 1750 = 3500, less the 200 G payout.
      expect(result).toEqual({
        results: [{ premium: 181 }, { payout: 200, remainingCap: 3300 }],
      });
    });
    it("two successive 1500 G claims on a sword → payouts 1400 G then 600 G, remaining cap 0 G", () => {
      const claim = {
        op: "claim" as const,
        policy: 0,
        incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
      };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          claim,
          claim,
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword, sword] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 225 }, { payout: 200, remainingCap: 3800 }],
      });
    });
    it("two sword damage entries against two insured swords → each gets its own deductible", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword, sword] },
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
      });

      // (500 − 100) + (300 − 100) = 600, not 800 − 100.
      expect(result).toEqual({
        results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
      });
    });
    it("more damage entries of a type than insured → the claim is rejected", () => {
      const runTwoSwordDamagesAgainstOneSword = () =>
        runScenario({
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
                cause: "dragon",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        });

      expect(runTwoSwordDamagesAgainstOneSword).toThrow(/sword/i);
    });
  });

  describe("claim — rounding in the MHPCO's favour", () => {
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
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 901 }] },
          },
        ],
      });

      // 901 × 50 % = 450.5, − 100 deductible = 350.5, rounded down to 350.
      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
      });
    });
  });

  describe("errors", () => {
    it("a quote with an unknown item type (broomstick) → rejected with an error description", () => {
      const quoteABroomstick = () =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        });

      expect(quoteABroomstick).toThrow(/broomstick/i);
    });
    it("a claim damaging an amulet when only a sword is insured → rejected", () => {
      const claimAgainstUninsuredAmulet = () =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
            },
          ],
        });

      expect(claimAgainstUninsuredAmulet).toThrow(/amulet/i);
    });
    it("a claim damaging an item with an unknown type → rejected", () => {
      const claimAgainstBroomstick = () =>
        runScenario({
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
                damages: [{ itemType: "broomstick", amount: 300 }],
              },
            },
          ],
        });

      expect(claimAgainstBroomstick).toThrow(/broomstick/i);
    });
    // Not in the spec's list, but the CLI reads untrusted JSON, so a bad
    // policy index deserves the same descriptive rejection as the rest.
    it("a claim referencing a policy step that does not exist → rejected", () => {
      const claimAgainstMissingPolicy = () =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
            },
            {
              op: "claim",
              policy: 7,
              incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
            },
          ],
        });

      expect(claimAgainstMissingPolicy).toThrow(/policy/i);
      expect(claimAgainstMissingPolicy).toThrow(/7/);
    });

    it("a claim with a damage entry of amount -200 → rejected", () => {
      const claimANegativeDamage = () =>
        runScenario({
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
        });

      expect(claimANegativeDamage).toThrow(/-200|negative/i);
    });
  });
});
