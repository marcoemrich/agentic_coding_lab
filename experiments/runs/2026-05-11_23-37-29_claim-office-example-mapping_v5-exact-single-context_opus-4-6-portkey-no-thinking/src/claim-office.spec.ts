import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("should return 5G premium for empty item list (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("should return 105G for a single plain sword (100G base + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should return 65G for a single plain amulet (60G base + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should return 85G for a single plain staff (80G base + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should return 45G for a single plain potion (40G base + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("should return 165G for a plain sword and plain amulet (100+60 + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - components", () => {
    it("should return 55G for 2 runes (2×25 + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("should return 65G for 3 runes (block of 3 alike = 60 + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should return 105G for 4 runes (4×25 = 100 + 5G fee, no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should return 180G for 7 runes (7×25 = 175 + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 198 });
    });
    it("should return 80G for 2 runes + 1 moonstone (no block: different types, 75 + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("should return 125G for 3 runes + 3 moonstones (two separate blocks, 120 + 5G fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
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
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - item-level modifiers", () => {
    it("should add 50% cursed surcharge to cursed item only", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      // 100 base + 50 curse + 10 first ins + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("should add 30% high-enchantment surcharge for enchantment >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // 100 base + 30 ench + 10 first ins + 5 fee = 145
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("should apply both cursed and high-enchantment surcharges on same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      });
      // 100 base + 50 curse + 30 ench + 10 first ins + 5 fee = 195
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("should not add high-enchantment surcharge for enchantment 4", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: false },
            ],
          },
        ],
      });
      // 100 base + 10 first ins + 5 fee = 115 (no enchantment surcharge)
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should apply cursed surcharge only to cursed item in multi-item policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 100+60 base=160 + 50 curse + 16 first ins(10% of 160) + 5 fee = 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-level modifiers", () => {
    it("should apply 20% loyalty discount for customer with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 100 base - 20 loyalty + 10 first ins + 5 fee = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("should apply 10% first insurance surcharge (always applies)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 100 base + 10 first insurance (10% of 100) + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should apply 15% follow-up discount on second quote", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // First quote: 100 base + 10 first ins + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: 100 base + 10 first ins - 15 follow-up (15% of 100) + 5 fee = 100
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("Quote - integration", () => {
    it("should compute 165G for newcomer with cursed sword (100 base + 50 curse + 10 first ins + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("should compute 160G for long-standing customer second contract with cursed enchanted sword", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      // Second quote: 100 base + 50 curse + 30 ench - 20 loyalty + 10 first ins - 15 follow-up + 5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
    it("should round premium up in MHPCO's favor", () => {
      // 7 runes: base=175, first ins=17.5 → 192.5 + 5 = 197.5 → ceil = 198
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 198 });
    });
  });

  describe("Claim - basic reimbursement", () => {
    it("should apply 100G deductible per damaged item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // 500 damage - 100 deductible = 400 payout; cap = 2×1000 = 2000, remaining = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should fully reimburse regular item damage minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      });
      // amulet insurance value = 600, cap = 1200
      // 300 damage - 100 deductible = 200 payout; remainingCap = 1200 - 200 = 1000
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1000 });
    });
    it("should reimburse component damage minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      // 3 runes, insurance = 3×250 = 750, cap = 1500
      // 200 damage - 100 deductible = 100 payout; remainingCap = 1500 - 100 = 1400
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1400 });
    });
  });

  describe("Claim - special clauses", () => {
    it("should reimburse at 50% for enchantment >= 8, then deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // enchantment >= 8: 50% of 1000 = 500, then -100 deductible = 400
      // insurance sum = 1000, cap = 2000, remainingCap = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should fully reimburse dragon material items, then deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      // dragon material: full reimbursement, then deductible: 800 - 100 = 700
      // insurance sum = 1000, cap = 2000, remainingCap = 2000 - 700 = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should apply 50% rule when both dragon material and enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // both dragon and enchantment >= 8: 50% rule wins
      // 50% of 1000 = 500, then -100 deductible = 400
      // insurance sum = 1000, cap = 2000, remainingCap = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should fully reimburse dragon material with enchantment < 8, then deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 7, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 600 }],
            },
          },
        ],
      });
      // dragon material, enchantment 7 (< 8): full reimbursement
      // 600 - 100 deductible = 500
      // insurance sum = 1000, cap = 2000, remainingCap = 2000 - 500 = 1500
      expect(result.results[1]).toEqual({ payout: 500, remainingCap: 1500 });
    });
  });

  describe("Claim - cap", () => {
    it("should cap total payout at 2x insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });
      // sword insurance = 1000, cap = 2000
      // 2500 - 100 deductible = 2400, but capped at 2000
      // remainingCap = 0
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should track remaining cap across multiple claims", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      // sword insurance = 1000, cap = 2000
      // first claim: 1500 - 100 = 1400, remainingCap = 600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // second claim: 1500 - 100 = 1400, but cap remaining = 600, payout = 600
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should reduce payout to remaining cap when cap is nearly exhausted", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "potion", amount: 700 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "potion", amount: 500 }],
            },
          },
        ],
      });
      // potion insurance = 400, cap = 800
      // first claim: 700 - 100 = 600, remainingCap = 800 - 600 = 200
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 200 });
      // second claim: 500 - 100 = 400, but only 200 remaining, payout = 200
      expect(result.results[2]).toEqual({ payout: 200, remainingCap: 0 });
    });
  });

  describe("Claim - multiple damages in one event", () => {
    it("should apply deductible per damaged item in multi-damage event", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
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
      // sword: 500 - 100 = 400, amulet: 300 - 100 = 200, total = 600
      // insurance sum = 1000 + 600 = 1600, cap = 3200, remainingCap = 3200 - 600 = 2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("should handle two items of same type insured and damaged separately", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 800 },
                { itemType: "sword", amount: 600 },
              ],
            },
          },
        ],
      });
      // 2 swords: insurance = 2000, cap = 4000
      // damage 1: 800 - 100 = 700, damage 2: 600 - 100 = 500, total = 1200
      // remainingCap = 4000 - 1200 = 2800
      expect(result.results[1]).toEqual({ payout: 1200, remainingCap: 2800 });
    });
  });

  describe("Error handling", () => {
    it("should reject unknown item type in quote", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
              ],
            },
          ],
        })
      ).toThrow();
    });
    it("should reject claim referencing uninsured item type", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim" as const,
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "amulet", amount: 300 }],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("should reject negative damage amount", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim" as const,
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("should reject more damages of a type than insured", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim" as const,
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
        })
      ).toThrow();
    });
  });

  describe("CLI", () => {
    it("should read JSON from stdin and write results to stdout", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      const output = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
        encoding: "utf-8",
      });
      const result = JSON.parse(output.trim());
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should exit with non-zero status on error and write to stderr", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      try {
        execSync(`echo '${input}' | npx tsx src/cli.ts`, {
          encoding: "utf-8",
          stdio: ["pipe", "pipe", "pipe"],
        });
        expect.unreachable("Should have thrown");
      } catch (err: any) {
        expect(err.status).not.toBe(0);
        expect(err.stderr).toContain("Unknown item type");
      }
    });
  });
});
