import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting", () => {
    it("should compute base premium for a single sword", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      // base 100 + 10% first insurance = 110 + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should compute base premium for each item type (amulet, staff, potion)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      // base 60 + 10% first insurance = 66 + 5 fee = 71
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should compute base premium for a single component (rune)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 1, cursed: false },
            ],
          },
        ],
      });
      // base 25 * 1.10 = 27.5 → ceil = 28 + 5 fee = 33
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should sum premiums for multiple different items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      // base: sword 100 + amulet 60 = 160, * 1.10 = 176 + 5 = 181
      expect(result.results[0]).toEqual({ premium: 181 });
    });
    it("should bundle 3 alike components at special rate of 60G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 1, cursed: false },
              { type: "rune", material: "stone", enchantment: 1, cursed: false },
              { type: "rune", material: "stone", enchantment: 1, cursed: false },
            ],
          },
        ],
      });
      // 3 runes bundled = 60G base, * 1.10 = 66 + 5 = 71
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should add 50% surcharge for cursed items", () => {
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
      // base 100 + 50% cursed = 150, * 1.10 first insurance = 165 + 5 = 170
      expect(result.results[0]).toEqual({ premium: 170 });
    });
    it("should add 30% surcharge for highly enchanted items (enchantment >= 5)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "oak", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // base 80 * 1.30 enchantment = 104, * 1.10 first insurance = 114.4 → ceil 115 + 5 = 120
      expect(result.results[0]).toEqual({ premium: 120 });
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      // base 100, loyalty -20% = 80, multi-contract -15% = 68, + 5 fee = 73
      expect(result.results[0]).toEqual({ premium: 73 });
    });
    it("should apply 10% first insurance surcharge on first contract", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 1, cursed: false },
            ],
          },
        ],
      });
      // base 40 * 1.10 first insurance = 44 + 5 = 49
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("should apply 15% discount on each contract after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      // base 100, no loyalty (1 year < 2), multi-contract * 0.85 = 85 + 5 = 90
      expect(result.results[0]).toEqual({ premium: 90 });
    });
    it("should add 5G processing fee to every premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      // base 60, loyalty *0.80 = 48, multi-contract *0.85 = 40.8, + 5 fee = 45.8, ceil = 46
      expect(result.results[0]).toEqual({ premium: 46 });
    });
    it("should round amounts in MHPCO's favor (ceiling)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 1, cursed: false },
            ],
          },
        ],
      });
      // base 40, loyalty *0.80 = 32, multi-contract *0.85 = 27.2, + 5 = 32.2, ceil = 33
      expect(result.results[0]).toEqual({ premium: 33 });
    });
  });

  describe("Claims", () => {
    it("should reimburse damage minus 100G deductible", () => {
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
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });
      // damage 300 - 100 deductible = 200 payout, cap = 2*1000 - 200 = 1800
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should not pay out if damage is less than deductible", () => {
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
              damages: [{ itemType: "sword", amount: 50 }],
            },
          },
        ],
      });
      // damage 50 < 100 deductible → payout 0, cap unchanged = 2*1000 = 2000
      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it("should cap total payout at twice the insurance sum", () => {
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
              damages: [{ itemType: "sword", amount: 2200 }],
            },
          },
        ],
      });
      // damage 2200 - 100 deductible = 2100, but cap is 2*1000 = 2000
      // payout clamped to 2000, remainingCap = 0
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should reimburse dragon material damage at 100%", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });
      // dragon material → 100% reimbursement, damage 300 - 100 deductible = 200
      // cap = 2*1000 = 2000, remainingCap = 2000 - 200 = 1800
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should reimburse high enchantment (>= 8) damage at 50%", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "oak", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "spell mishap",
              damages: [{ itemType: "staff", amount: 400 }],
            },
          },
        ],
      });
      // enchantment 9 >= 8 → 50% reimbursement: 400 * 0.50 = 200
      // after deductible: 200 - 100 = 100
      // cap = 2*800 = 1600, remainingCap = 1600 - 100 = 1500
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1500 });
    });
    it("should track remaining cap across multiple claims on same policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
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
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 500 }],
            },
          },
        ],
      });
      // claim 1: damage 300 - 100 deductible = 200 payout, cap = 2*600 = 1200, remaining = 1000
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1000 });
      // claim 2: damage 500 - 100 deductible = 400 payout, remaining = 1000 - 400 = 600
      expect(result.results[2]).toEqual({ payout: 400, remainingCap: 600 });
    });
  });
});
