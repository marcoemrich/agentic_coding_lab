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
    it("a sword → base premium 100 G, +10 G first insurance, +5 G fee → premium 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("an amulet → base premium 60 G, +6 G first insurance, +5 G fee → premium 71 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("a staff → base premium 80 G, +8 G first insurance, +5 G fee → premium 93 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("a potion → base premium 40 G, +4 G first insurance, +5 G fee → premium 49 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("a single rune → base premium 25 G, +2.5 G first insurance, +5 G fee → premium 33 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("a single moonstone → base premium 25 G, +2.5 G first insurance, +5 G fee → premium 33 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium (no block) → premium 60 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes → 60 G base premium (block applies) → premium 71 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3) → premium 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → 175 G base premium (no block) → 197.5 G rounds up to premium 198 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
      });

      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types) → premium 88 G", () => {
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
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) → premium 137 G", () => {
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
    it("3 swords → 300 G base premium (block applies to components only) → premium 335 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array.from({ length: 3 }, () => ({ type: "sword" })) }],
      });

      expect(result).toEqual({ results: [{ premium: 335 }] });
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("cursed sword (steel, enchantment 3) → 100 base + 50 curse + 10 first insurance + 5 fee = 165 G", () => {
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
    it("sword with exactly enchantment 5 → 100 base + 30 enchantment + 10 first insurance + 5 fee = 145 G", () => {
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
    it("sword with enchantment 4 → no high-enchantment surcharge → premium 115 G", () => {
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
    it("cursed sword with enchantment 5 → both surcharges apply → premium 195 G", () => {
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
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years → 100 base − 20 loyalty + 10 first insurance + 5 fee = 95 G", () => {
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
    it("customer with 1 year → no loyalty discount → premium 115 G", () => {
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
    it("second quote: 3-year customer, cursed sword ench. 7 → 100 + 50 − 20 + 30 + 10 − 15 + 5 = 160 G", () => {
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

      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote — modifier scope on multi-item policies", () => {
    it("cursed sword + plain amulet → curse adds 50 G (50 % of the sword only) → premium 231 G", () => {
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

  describe("quote — rounding in the MHPCO's favor", () => {
    it("intermediate amounts stay fractional; only the final premium is rounded (81.5 → 82 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });

      // base 85; +8.5 first insurance; −17 loyalty; +5 fee = 81.5, rounded up once.
      expect(result).toEqual({ results: [{ premium: 82 }] });
    });
  });

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G, remainingCap 1600 G", () => {
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

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (no enchantment or material), damage 200 G → payout 100 G", () => {
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

      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("claim — special clauses", () => {
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement)", () => {
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

      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
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

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
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

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim — deductible per damage event", () => {
    it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible each)", () => {
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

      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim — cap", () => {
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

      expect(result.results[0]).toEqual({ premium: 165 });
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] },
          },
        ],
      });

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

      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("second claim of 1500 G → payout 600 G, remainingCap 0 G (reduced to remaining cap)", () => {
      const claimStep = {
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
          claimStep,
          claimStep,
        ],
      });

      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
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

      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("multiple items of the same type", () => {
    it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
      const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword, sword] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
    });
    it("two sword damage entries → each treated as a separate damage with its own deductible", () => {
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

      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("more damage entries of a type than insured (2 sword damages, 1 sword) → whole claim rejected", () => {
      expect(() =>
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
        }),
      ).toThrow(/insures only 1 sword/);
    });
  });
});
