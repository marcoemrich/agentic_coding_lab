import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";
import type { Scenario, Item } from "./scenario.js";

// Tests for the MHPCO Claim Office kata.
// Covers every rule and example from prompt.md.
// Customer defaults: yearsWithMHPCO = 0 (newcomer), first contract
// unless otherwise noted.

describe("MHPCO Claim Office", () => {
  // ============================================================
  // Quote - single item base premiums (no special modifiers)
  // ============================================================
  describe("Quote - single item base premiums (newcomer, first contract)", () => {
    it("1 sword -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const input = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 115 }] });
    });
    it("1 amulet -> premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
      const input = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 71 }] });
    });
    it("1 staff -> premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
      const input = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 93 }] });
    });
    it("1 potion -> premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
      const input = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 49 }] });
    });
    it("1 rune -> premium 33 G (25 base + 2.5 first insurance + 5 fee, ceil from 32.5)", () => {
      const input = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 33 }] });
    });
    it("1 moonstone -> premium 33 G (25 base + 2.5 first insurance + 5 fee, ceil from 32.5)", () => {
      const input = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 33 }] });
    });
  });

  // ============================================================
  // Quote - building block of 3 alike components
  // ============================================================
  describe("Quote - building block of 3 alike components", () => {
    it("2 runes -> premium 60 G (base 50 + 5 first insurance + 5 fee, no block)", () => {
      const input = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes -> premium 71 G (base 60 + 6 first insurance + 5 fee, block applies)", () => {
      const input = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes -> premium 115 G (base 100 + 10 first insurance + 5 fee, no block - requires exactly 3)", () => {
      const input = {
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
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes -> premium 198 G (base 175 + 17.5 first insurance + 5 fee, ceil from 197.5)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: Array(7).fill({ type: "rune" }) as Item[] },
        ],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone -> premium 88 G (base 75 + 7.5 first insurance + 5 fee, ceil from 87.5, no block - different types)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones -> premium 137 G (base 120 + 12 first insurance + 5 fee, two separate blocks)", () => {
      const input: Scenario = {
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
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 137 }] });
    });
  });

  // ============================================================
  // Quote - premium modifiers (item-specific and policy-wide)
  // ============================================================
  describe("Quote - premium modifiers", () => {
    it("Newcomer, first contract, cursed sword (steel, enchantment 3) -> premium 165 G", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 165 }] });
    });
    it("Customer with exactly 2 years (first contract), plain sword -> loyalty applies (premium 95 G)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 95 }] });
    });
    it("Customer with 1 year (first contract), plain sword -> no loyalty (premium 115 G)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 115 }] });
    });
    it("Plain sword enchantment 5 (newcomer, first contract) -> high-enchantment surcharge applies (premium 145 G)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 145 }] });
    });
    it("Plain sword enchantment 4 (newcomer, first contract) -> no high-enchantment surcharge (premium 115 G)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 115 }] });
    });
    it("Cursed sword enchantment 5 (newcomer, first contract) -> both curse and high-enchantment surcharges (premium 195 G)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", enchantment: 5, cursed: true }],
          },
        ],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 195 }] });
    });
    it("Cursed sword enchantment 4 (newcomer, first contract) -> only curse surcharge applies (premium 165 G)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", enchantment: 4, cursed: true }],
          },
        ],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 165 }] });
    });
    it("Long-standing customer (3 years), 2nd contract, cursed sword (steel, enchantment 7) -> premium 160 G", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] }, // first contract
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      };
      expect(runScenario(input)).toEqual({
        results: [{ premium: 95 }, { premium: 160 }],
      });
    });
  });

  // ============================================================
  // Quote - modifier scope on multi-item policies
  // ============================================================
  describe("Quote - modifier scope on multi-item policies", () => {
    it("Cursed sword + plain amulet (newcomer, first contract) -> premium 231 G (item-specific curse + policy-wide first insurance)", () => {
      const input: Scenario = {
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
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 231 }] });
    });
  });

  // ============================================================
  // Quote - edge cases
  // ============================================================
  describe("Quote - edge cases", () => {
    it("Empty item list -> premium 5 G (only processing fee)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      };
      expect(runScenario(input)).toEqual({ results: [{ premium: 5 }] });
    });
    it("Quote with unknown item type -> throws (CLI exits with non-zero status code)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };
      expect(() => runScenario(input)).toThrow();
    });
  });

  // ============================================================
  // Claim - basic reimbursement
  // ============================================================
  describe("Claim - basic reimbursement", () => {
    it("Regular sword (steel, enchantment 3), damage 500 -> payout 400 G, remaining cap 1600 G", () => {
      const input: Scenario = {
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
      };
      expect(runScenario(input)).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("Rune (no enchantment/material), damage 200 -> payout 100 G, remaining cap 400 G", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      };
      expect(runScenario(input)).toEqual({
        results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
      });
    });
  });

  // ============================================================
  // Claim - deductible per damage event
  // ============================================================
  describe("Claim - deductible per damage event", () => {
    it("Dragon damages sword (500) and amulet (300) -> payout 600 G (each damage has its own 100 G deductible)", () => {
      const input: Scenario = {
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
      };
      const output = runScenario(input);
      expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  // ============================================================
  // Claim - enchantment threshold vs. dragon material
  // ============================================================
  describe("Claim - enchantment threshold vs. dragon material", () => {
    it("Dragon-material sword enchantment 9, damage 1000 -> payout 400 G (high-enchantment wins over dragon)", () => {
      const input: Scenario = {
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
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const output = runScenario(input);
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("Dragon-material sword enchantment 5, damage 800 -> payout 700 G (only dragon applies, full reimbursement)", () => {
      const input: Scenario = {
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
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      };
      const output = runScenario(input);
      expect(output.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("Steel sword enchantment 9, damage 1000 -> payout 400 G (only high-enchantment applies, 50% rule)", () => {
      const input: Scenario = {
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
      };
      const output = runScenario(input);
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("Dragon-material sword enchantment 8 (exact threshold), damage 1000 -> payout 400 G (high-enchantment wins)", () => {
      const input: Scenario = {
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
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const output = runScenario(input);
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  // ============================================================
  // Claim - cap (based on unmodified insurance sum)
  // ============================================================
  describe("Claim - cap", () => {
    it("Sword + amulet policy -> insurance sum 1600 G, cap 3200 G (2 x insurance sum)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "minor scuff",
              damages: [{ itemType: "sword", amount: 50 }],
            },
          },
        ],
      };
      const output = runScenario(input);
      // Damage 50 < 100 deductible => payout 0, remaining cap = full cap
      expect(output.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
    });
    it("Cursed sword policy -> cap 2000 G (based on unmodified insurance value, premium modifiers do not raise cap)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "minor scuff",
              damages: [{ itemType: "sword", amount: 50 }],
            },
          },
        ],
      };
      const output = runScenario(input);
      expect(output.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it("Sword + 3 runes (block) policy -> insurance sum 1750 G, cap 3500 G (block affects premium only, not insurance)", () => {
      const input: Scenario = {
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
              cause: "minor scuff",
              damages: [{ itemType: "sword", amount: 50 }],
            },
          },
        ],
      };
      const output = runScenario(input);
      expect(output.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
    });
    it("Cap exhaustion: sword policy (cap 2000), two claims of 1500 G -> first payout 1400 remaining 600, second payout 600 remaining 0", () => {
      const input: Scenario = {
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
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      };
      const output = runScenario(input);
      expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(output.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  // ============================================================
  // Claim - multiple items of the same type
  // ============================================================
  describe("Claim - multiple items of the same type", () => {
    it("Policy covers 2 swords -> insurance sum 2000 G, cap 4000 G", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "minor scuff",
              damages: [{ itemType: "sword", amount: 50 }],
            },
          },
        ],
      };
      const output = runScenario(input);
      expect(output.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
    });
    it("Dragon damages both swords -> each entry treated as separate damage with its own deductible", () => {
      const input: Scenario = {
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
      };
      const output = runScenario(input);
      // 500 - 100 + 300 - 100 = 600; cap 4000 - 600 = 3400
      expect(output.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("Damages array has more sword entries than the policy covers -> claim rejected (throws)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "duplicate damage",
              damages: [
                { itemType: "sword", amount: 100 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      };
      expect(() => runScenario(input)).toThrow();
    });
  });

  // ============================================================
  // Claim - rounding
  // ============================================================
  describe("Claim - rounding", () => {
    it("Steel sword enchantment 9, damage 901 -> payout 350 G (rounded down from 350.5)", () => {
      const input: Scenario = {
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
      };
      const output = runScenario(input);
      // 50% * 901 = 450.5; - 100 = 350.5; floor = 350
      expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  // ============================================================
  // Claim - edge cases
  // ============================================================
  describe("Claim - edge cases", () => {
    it("Damage entry for item not in policy -> throws (CLI exits non-zero)", () => {
      const input: Scenario = {
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
      };
      expect(() => runScenario(input)).toThrow();
    });
    it("Damage entry with negative amount (-200) -> throws (CLI exits non-zero)", () => {
      const input: Scenario = {
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
      };
      expect(() => runScenario(input)).toThrow();
    });
    it("Damage entry for unknown item type -> throws (CLI exits non-zero)", () => {
      const input: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 100 }],
            },
          },
        ],
      };
      expect(() => runScenario(input)).toThrow();
    });
  });
});
