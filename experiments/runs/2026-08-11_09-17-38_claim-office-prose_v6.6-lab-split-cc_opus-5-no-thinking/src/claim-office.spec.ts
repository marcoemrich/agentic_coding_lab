import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quoting a premium — price list", () => {
    it("quotes a sword: base 100 G + 10 % first-insurance surcharge + 5 G fee = 115 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("quotes an amulet: base 60 G + 10 % + 5 G = 71 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    });
    it("quotes a staff: base 80 G + 10 % + 5 G = 93 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
    });
    it("quotes a potion: base 40 G + 10 % + 5 G = 49 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
    });
    it("quotes a single rune component: base 25 G + 10 % + 5 G = 33 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune", material: "stone", enchantment: 1, cursed: false }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
    });
    it("quotes a single moonstone component: base 25 G + 10 % + 5 G = 33 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "moonstone", material: "stone", enchantment: 0, cursed: false }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
    });
    it("sums the base premiums of several main items: sword + potion = 140 G base, + 10 % + 5 G = 159 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: false },
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 159 }] });
    });
  });

  describe("quoting a premium — component building blocks", () => {
    it("charges 60 G for a building block of 3 alike components instead of 75 G: + 10 % + 5 G = 71 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    });
    it("charges 60 G + 25 G for 4 alike components: + 10 % + 5 G = 99 G", () => {
      const rune = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [rune, rune, rune, rune] }],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 99 }] });
    });
    it("charges 120 G for 6 alike components (two building blocks): + 10 % + 5 G = 137 G", () => {
      const rune = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [rune, rune, rune, rune, rune, rune] }],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
    });
    it("does not form a building block from unalike components: 2 runes + 1 moonstone = 75 G base, + 10 % + 5 G = 88 G", () => {
      const rune = { type: "rune", material: "stone", enchantment: 0, cursed: false };
      const moonstone = { type: "moonstone", material: "stone", enchantment: 0, cursed: false };
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [rune, rune, moonstone] }],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
    });
  });

  describe("quoting a premium — risk surcharges", () => {
    it("adds a 50 % risk surcharge for a cursed sword: 150 G, + 10 % + 5 G = 170 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 2, cursed: true }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 170 }] });
    });
    it("adds a 30 % risk surcharge for a highly enchanted sword (enchantment 5): 130 G, + 10 % + 5 G = 148 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 148 }] });
    });
    it("does not add the enchantment surcharge below level 5 (enchantment 4): 100 G, + 10 % + 5 G = 115 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("applies both surcharges to a cursed, highly enchanted sword: 100 × 1.5 × 1.3 = 195 G, + 10 % + 5 G = 220 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 6, cursed: true }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 220 }] });
    });
    it("applies risk surcharges per item, not to the whole policy: cursed sword + plain potion = 190 G, + 10 % + 5 G = 214 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: true },
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 214 }] });
    });
  });

  describe("quoting a premium — customer modifiers", () => {
    it("gives a 20 % loyalty discount to a customer of 2 years: sword 100 × 1.1 × 0.8 = 88 G + 5 G = 93 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
    });
    it("gives no loyalty discount to a customer of 1 year: sword = 115 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("applies the 10 % initial assessment surcharge only to the first contract — the second contract is 90 G, not the 99 G it would be if the surcharge compounded with the repeat discount", () => {
      const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [sword] },
          { op: "quote" as const, items: [sword] },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 115 }, { premium: 90 }],
      });
    });
    it("gives a 15 % discount on the second contract: sword 100 × 0.85 + 5 G = 90 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [sword] },
          { op: "quote" as const, items: [sword] },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 115 }, { premium: 90 }],
      });
    });
    it("gives the 15 % discount on the third contract as well: sword 100 × 0.85 + 5 G = 90 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [sword] },
          { op: "quote" as const, items: [sword] },
          { op: "quote" as const, items: [sword] },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 115 }, { premium: 90 }, { premium: 90 }],
      });
    });
    it("combines loyalty and repeat-contract discounts on a later contract: sword 100 × 0.8 × 0.85 + 5 G = 73 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote" as const, items: [sword] },
          { op: "quote" as const, items: [sword] },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 93 }, { premium: 73 }],
      });
    });
    it("adds the 5 G processing fee to every premium, including repeat contracts", () => {
      const potion = { type: "potion", material: "glass", enchantment: 0, cursed: false };
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote" as const, items: [potion] },
          { op: "quote" as const, items: [potion] },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 49 }, { premium: 39 }],
      });
    });
  });

  describe("quoting a premium — rounding", () => {
    it("rounds the premium up, in the MHPCO's favor: amulet for a 5-year customer 60 × 1.1 × 0.8 = 52.8 → 53 G + 5 G = 58 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 58 }] });
    });
  });

  describe("processing claims — deductible and reimbursement", () => {
    it("subtracts the 100 G deductible from the damage amount: 200 G damage on an amulet pays out 100 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 58 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("pays out 0 G when the damage does not exceed the deductible: 60 G damage pays out 0 G, never a negative amount", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "clumsiness", damages: [{ itemType: "amulet", amount: 60 }] },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 58 }, { payout: 0, remainingCap: 1200 }],
      });
    });
    it("applies the deductible once per damage event, not per damaged item: two 200 G damages in one incident pay out 300 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "amulet", amount: 200 },
              ],
            },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 146 }, { payout: 300, remainingCap: 2900 }],
      });
    });
    it("reimburses damage to an item with enchantment 8 at 50 %: 500 G damage → 250 G − 100 G deductible = 150 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "dragon fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 120 }, { payout: 150, remainingCap: 1850 }],
      });
    });
    it("reimburses damage to an item with enchantment 7 in full: 500 G damage → 400 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "troll attack", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 120 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("fully reimburses damage to an item made of dragon material even at enchantment 8: 500 G damage → 400 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "rockfall", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 120 }, { payout: 400, remainingCap: 1600 }],
      });
    });
  });

  describe("processing claims — payout cap", () => {
    it("reports the remaining cap after a claim: staff insured at 800 G has a 1600 G cap, 300 G damage leaves 1400 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "storm", damages: [{ itemType: "staff", amount: 300 }] },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 76 }, { payout: 200, remainingCap: 1400 }],
      });
    });
    it("caps the payout at twice the insurance sum: a single huge claim on an amulet pays at most 1200 G and leaves 0 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "catastrophe", damages: [{ itemType: "amulet", amount: 5000 }] },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 58 }, { payout: 1200, remainingCap: 0 }],
      });
    });
    it("caps the cumulative payout across several claims on the same policy", () => {
      const claimOf900 = {
        op: "claim" as const,
        policy: 0,
        incident: { cause: "raid", damages: [{ itemType: "amulet", amount: 900 }] },
      };
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          claimOf900,
          claimOf900,
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [
          { premium: 58 },
          { payout: 800, remainingCap: 400 },
          { payout: 400, remainingCap: 0 },
        ],
      });
    });
    it("pays out 0 G once the cap is exhausted", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "flood", damages: [{ itemType: "amulet", amount: 1400 }] },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "aftermath", damages: [{ itemType: "amulet", amount: 500 }] },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [
          { premium: 58 },
          { payout: 1200, remainingCap: 0 },
          { payout: 0, remainingCap: 0 },
        ],
      });
    });
    it("bases the cap on the summed insurance value of all insured items: sword + amulet = 1600 G insured → 3200 G cap", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "cataclysm", damages: [{ itemType: "sword", amount: 4000 }] },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 146 }, { payout: 3200, remainingCap: 0 }],
      });
    });
    it("tracks caps of several policies independently", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "flood", damages: [{ itemType: "amulet", amount: 1400 }] },
          },
          {
            op: "claim" as const,
            policy: 1,
            incident: { cause: "spill", damages: [{ itemType: "potion", amount: 300 }] },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [
          { premium: 58 },
          { premium: 33 },
          { payout: 1200, remainingCap: 0 },
          { payout: 200, remainingCap: 600 },
        ],
      });
    });
  });

  describe("scenario processing", () => {
    it("returns an empty results array for a scenario without steps", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [] };

      expect(runScenario(scenario)).toEqual({ results: [] });
    });
    it("returns one result per step, in order, matching the schema example 1 shape", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
          },
          {
            op: "quote" as const,
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 115 }, { premium: 73 }, { premium: 39 }],
      });
    });
    it("processes a quote followed by two claims against it, as in schema example 2", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: { cause: "spell mishap", damages: [{ itemType: "amulet", amount: 250 }] },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [
          { premium: 58 },
          { payout: 100, remainingCap: 1100 },
          { payout: 150, remainingCap: 950 },
        ],
      });
    });
  });
});
