import { spawnSync } from "node:child_process";
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

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("a single amulet → base premium 60 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("a single staff → base premium 80 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
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
    it("a single rune → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("a single moonstone → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("quote — component building blocks", () => {
    it("2 runes → 50 G base premium (no block)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });

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

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → 175 G base premium (no block)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
        ],
      });

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

      expect(result).toEqual({ results: [{ premium: 88 }] });
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

      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("a cursed sword adds a 50 % risk surcharge to that item's base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });

      // 100 G base + 50 G curse + 10 G assessment (10 % of base) + 5 G fee.
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("a sword with enchantment 5 adds a 30 % high-enchantment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });

      // 100 G base + 30 G high enchantment + 10 G assessment + 5 G fee.
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("a sword with enchantment 4 gets no high-enchantment surcharge", () => {
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
    it("a cursed sword with enchantment 5 gets both surcharges", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });

      // 100 G base + 50 G curse + 30 G high enchantment + 10 G assessment + 5 G fee.
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("a cursed sword and a plain amulet → policy base 160 G, curse adds 50 G (50 % of the cursed item only) → 210 G before policy modifiers and fee", () => {
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

      // 210 G before further modifiers, + 16 G assessment (10 % of the 160 G
      // policy base premium) + 5 G fee = 231 G.
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("a customer with exactly 2 years with MHPCO receives the 20 % loyalty discount", () => {
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
    it("a customer with 1 year with MHPCO receives no loyalty discount", () => {
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
    it("every quote carries the 10 % initial assessment surcharge", () => {
      const plainSword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [plainSword] },
          { op: "quote", items: [plainSword] },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 95 }, { premium: 80 }] });
    });
    it("the second quote of a scenario receives the 15 % follow-up contract discount", () => {
      const plainSword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [plainSword] },
          { op: "quote", items: [plainSword] },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("the first quote of a scenario receives no follow-up contract discount", () => {
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
    // The 5 G processing fee is pinned by "empty item list → premium 5 G", which
    // isolates it, and is a component of every other premium expectation here.
  });

  describe("quote — rounding in the MHPCO's favour", () => {
    // The 197.5 → 198 example is pinned by "7 runes → 175 G base premium", whose
    // premium is exactly 175 × 1.1 + 5 = 197.5.
    it("intermediate amounts are kept as fractions; only the final premium is rounded", () => {
      // A cursed rune carries a fractional 12.5 G curse surcharge (50 % of 25 G).
      // Kept as a fraction: 25 + 12.5 − 2.5 + 5 = 40 exactly → 40.
      // Rounded up early:   25 + 13   − 2.5 + 5 = 40.5       → 41.
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "rune", cursed: true }] }],
      });

      expect(result).toEqual({ results: [{ premium: 40 }] });
    });
  });

  describe("quote — integration examples", () => {
    it("newcomer (0 years, no previous contract) with a cursed sword → premium 165 G", () => {
      // 100 G base + 50 G curse + 10 G initial assessment (10 % of the 100 G
      // policy base premium, not of the surcharged 150 G) = 160 G + 5 G fee.
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
    it("long-standing customer (3 years) second quote, cursed sword enchantment 7 → premium 160 G", () => {
      // Second quote: 100 G base + 50 G curse + 30 G high enchantment
      // − 20 G loyalty + 10 G initial assessment − 15 G follow-up = 155 G + 5 G fee.
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
            incident: { cause: "mishap", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
      });
    });
    // "the 100 G deductible applies once per damaged item" is pinned by the
    // two-item claim below: 400 + 200, not 800 − 100.
    it("a dragon attack damaging a sword (500 G) and an amulet (300 G) → payout 600 G", () => {
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

      expect(result).toEqual({
        results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
      });
    });
  });

  describe("claim — damages below the deductible", () => {
    it("a lone damage below the 100 G deductible pays nothing and leaves the cap intact", () => {
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
            incident: { cause: "scuff", damages: [{ itemType: "sword", amount: 50 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 115 }, { payout: 0, remainingCap: 2000 }],
      });
    });

    it("a damage below the deductible does not reduce what other damaged items pay out", () => {
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
                { itemType: "amulet", amount: 50 },
              ],
            },
          },
        ],
      });

      // The sword pays 400; the amulet's 50 G is below the deductible and pays 0.
      expect(result).toEqual({
        results: [{ premium: 181 }, { payout: 400, remainingCap: 2800 }],
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
      });
    });
    // Guards the precedence: dragon material must not promote a heavily
    // enchanted item back to full reimbursement.
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

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
            items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
  });

  describe("claim — insurance sum and cap", () => {
    // Insurance sum 1600 G / cap 3200 G is pinned by the dragon-attack claim
    // above, whose remainingCap of 2600 G is 3200 − 600.
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });

      // Premium 165 G reflects the curse; the cap stays at 2 × the unmodified
      // insurance value of 1000 G.
      expect(result).toEqual({
        results: [{ premium: 165 }, { payout: 100, remainingCap: 1900 }],
      });
    });
    it("a policy covering a sword and 3 runes → insurance sum 1750 G (the block discount affects the premium only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
        ],
      });

      // Premium takes the 60 G block price for the runes (base 100 + 60);
      // the insurance sum still counts them at 250 G each → 1750 G, cap 3500 G.
      expect(result).toEqual({
        results: [{ premium: 181 }, { payout: 200, remainingCap: 3300 }],
      });
    });
    it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword, sword] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 400 }] },
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 225 }, { payout: 300, remainingCap: 3700 }],
      });
    });

    it("3 swords are not a component block → base premium 300 G, not 60 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [sword, sword, sword] }],
      });

      // The block price is offered for components only, so 3 × 100 + 30 + 5.
      expect(result).toEqual({ results: [{ premium: 335 }] });
    });
    it("two successive claims of 1500 G against a 2000 G cap → 1400 G then 600 G, exhausting the cap", () => {
      const claimOf1500 = {
        op: "claim" as const,
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
          claimOf1500,
          claimOf1500,
        ],
      });

      // The second claim also wants 1400 G, but only 600 G of cap is left.
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
    it("two swords insured, both damaged → each damage entry is treated separately with its own deductible", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

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
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });

      // 400 + 200 — a deductible each, not one for the pair.
      expect(result).toEqual({
        results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
      });
    });

    it("more damage entries of a type than insured (two sword damages, one sword insured) → the claim is rejected", () => {
      const overClaiming = () =>
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
                cause: "dragon attack",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        });

      expect(overClaiming).toThrow();
    });
  });

  describe("claim — rounding in the MHPCO's favour", () => {
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

      // The halving clause gives 901 × 0.5 − 100 = 350.5, rounded down to 350.
      expect(result).toEqual({
        results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
      });
    });
  });

  describe("errors", () => {
    const insuredSword = {
      op: "quote" as const,
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
    };

    it("a quote with an unknown item type (e.g. broomstick) → error, no results", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow();
    });

    it("a claim referencing an item that is not part of the policy → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            insuredSword,
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
            },
          ],
        }),
      ).toThrow();
    });

    it("a claim referencing an item with an unknown type → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            insuredSword,
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
      ).toThrow();
    });
    it("a claim with a damage entry of amount -200 → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            insuredSword,
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("CLI", () => {
    const runCli = (input: string) =>
      spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });

    it("reads a scenario from stdin and writes {results} to stdout in step order", () => {
      const scenario = {
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
      };

      const cli = runCli(JSON.stringify(scenario));

      expect(cli.status).toBe(0);
      expect(JSON.parse(cli.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });

    it("exits with a non-zero status and writes to stderr on an invalid scenario", () => {
      const cli = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      );

      expect(cli.status).not.toBe(0);
      expect(cli.stderr).not.toBe("");
      expect(cli.stdout).not.toContain("results");
    });
  });
});
