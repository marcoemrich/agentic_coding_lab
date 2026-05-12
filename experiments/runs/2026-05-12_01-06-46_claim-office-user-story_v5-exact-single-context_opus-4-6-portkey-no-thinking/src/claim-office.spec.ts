import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting", () => {
    it("should calculate base premium for a single sword plus processing fee", () => {
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
      // Base premium: 100G, first insurance surcharge: +10% = 110G, processing fee: +5G = 115G
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should calculate base premium for other item types (amulet, staff, potion)", () => {
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
      // Base premium: 60G, first insurance surcharge: +10% = 66G, processing fee: +5G = 71G
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should calculate base premium for a single component", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Component base premium: 25G, initial assessment: +10% = ceil(2.5) = 3G, processing fee: +5G = 33G
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should apply special premium for a building block of 3 alike components", () => {
      const result = processScenario({
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
      });
      // Building block of 3 alike components: 60G base premium
      // Initial assessment: +10% = ceil(6) = 6G, processing fee: +5G = 71G
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should apply 50% cursed item surcharge", () => {
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
      // Base premium: 100G, cursed surcharge: +50% = 50G -> 150G
      // Initial assessment: +10% = ceil(15) = 15G, processing fee: +5G = 170G
      expect(result.results[0]).toEqual({ premium: 170 });
    });
    it("should apply 30% surcharge for enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // Base premium: 60G, enchantment surcharge: +30% = ceil(18) = 18G -> 78G
      // Initial assessment: +10% = ceil(7.8) = 8G, processing fee: +5G = 91G
      expect(result.results[0]).toEqual({ premium: 91 });
    });
    it("should apply 20% loyalty discount for customers with >= 2 years", () => {
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
      // Base premium: 100G, loyalty discount: -20% = floor(20) = 20G -> 80G
      // No initial assessment (not first insurance), processing fee: +5G = 85G
      expect(result.results[0]).toEqual({ premium: 85 });
    });
    it("should apply 10% initial assessment surcharge for first insurance", () => {
      // A customer with 1 year (not first-time) should NOT get the surcharge
      const returning = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // No initial assessment, no loyalty discount: 100G + 5G = 105G
      expect(returning.results[0]).toEqual({ premium: 105 });

      // A first-time customer (0 years) SHOULD get the surcharge
      const firstTime = processScenario({
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
      // Initial assessment: +10% = 110G + 5G = 115G
      expect(firstTime.results[0]).toEqual({ premium: 115 });
    });
    it("should apply 15% discount on contracts after the first", () => {
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
      // First contract: 100 + 10% initial = 110 + 5 = 115G
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second contract: 100 + 10% initial = 110, 15% discount = floor(16.5) = 16 -> 94 + 5 = 99G
      expect(result.results[1]).toEqual({ premium: 99 });
    });
    it("should quote multiple items in a single policy", () => {
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
      // Sword: 100G + Amulet: 60G = 160G total items premium
      // Initial assessment: +10% = ceil(16) = 16G -> 176G, processing fee: +5G = 181G
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Claims", () => {
    it("should apply 100G deductible per damage event", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
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
              damages: [
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      // Payout: 500 - 100 deductible = 400G
      // Remaining cap: 2 × 1000 insurance value - 400 = 1600G
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1200 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "spell mishap",
              damages: [{ itemType: "sword", amount: 1200 }],
            },
          },
        ],
      });
      // Claim 1: 1200 - 100 deductible = 1100G payout, remainingCap = 2000 - 1100 = 900G
      expect(result.results[1]).toEqual({ payout: 1100, remainingCap: 900 });
      // Claim 2: 1200 - 100 = 1100G, but capped at 900G remaining → payout = 900G
      expect(result.results[2]).toEqual({ payout: 900, remainingCap: 0 });
    });
    it("should reimburse at 50% for items with enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "spell mishap",
              damages: [{ itemType: "amulet", amount: 400 }],
            },
          },
        ],
      });
      // Enchantment >= 8: reimbursed at 50% → floor(400 * 0.5) = 200G
      // Deductible: 200 - 100 = 100G payout
      // Cap: 2 × 600 = 1200, remainingCap = 1200 - 100 = 1100G
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("should fully reimburse damage to dragon material items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
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
              cause: "battle damage",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });
      // Dragon material: fully reimbursed despite enchantment >= 8
      // Reimbursable: 400G (full), deductible: 400 - 100 = 300G payout
      // Cap: 2 × 1000 = 2000, remainingCap = 2000 - 300 = 1700G
      expect(result.results[1]).toEqual({ payout: 300, remainingCap: 1700 });
    });
  });
});
