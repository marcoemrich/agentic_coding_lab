import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting", () => {
    it("should calculate base premium for a single sword with first insurance surcharge and processing fee", () => {
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

      expect(result).toEqual({
        results: [{ premium: 115 }],
      });
    });
    it("should calculate base premium for each main item type", () => {
      const amuletResult = processScenario({
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
      expect(amuletResult).toEqual({ results: [{ premium: 71 }] });

      const staffResult = processScenario({
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
      expect(staffResult).toEqual({ results: [{ premium: 93 }] });

      const potionResult = processScenario({
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
      expect(potionResult).toEqual({ results: [{ premium: 49 }] });
    });
    it("should sum premiums for multiple items in one quote", () => {
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

      expect(result).toEqual({
        results: [{ premium: 181 }],
      });
    });
    it("should calculate premium for a single component", () => {
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

      expect(result).toEqual({
        results: [{ premium: 33 }],
      });
    });
    it("should apply building block pricing for 3 alike components", () => {
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

      expect(result).toEqual({
        results: [{ premium: 71 }],
      });
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

      expect(result).toEqual({
        results: [{ premium: 170 }],
      });
    });
    it("should apply 30% surcharge for enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 5, cursed: false },
            ],
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 120 }],
      });
    });
    it("should apply 20% loyalty discount for customers with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 53 }],
      });
    });
    it("should apply 15% multi-contract discount on subsequent quotes", () => {
      const result = processScenario({
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

      expect(result).toEqual({
        results: [{ premium: 90 }],
      });
    });
  });

  describe("Claims", () => {
    it("should apply 100G deductible to a basic claim", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 200, remainingCap: 1800 },
        ],
      });
    });
    it("should cap total payout at twice the insurance sum", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 2000, remainingCap: 0 },
        ],
      });
    });
    it("should reimburse at 50% for items with enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "tavern brawl",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 148 },
          { payout: 100, remainingCap: 1900 },
        ],
      });
    });
    it("should fully reimburse damage to dragon material items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "goblin raid",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 148 },
          { payout: 300, remainingCap: 1700 },
        ],
      });
    });
    it("should track remaining cap across multiple claims on same policy", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "tavern brawl",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });

      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 400, remainingCap: 1600 },
          { payout: 200, remainingCap: 1400 },
        ],
      });
    });
  });
});
