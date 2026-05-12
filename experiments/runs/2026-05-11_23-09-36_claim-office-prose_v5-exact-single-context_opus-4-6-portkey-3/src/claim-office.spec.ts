import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should compute premium for a single sword for a new customer (base + first insurance surcharge + processing fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };

      const result = processScenario(scenario);

      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should compute correct base premiums for each main item type (amulet, staff, potion)", () => {
      const makeScenario = (type: string) => ({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type, material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });

      expect(processScenario(makeScenario("amulet")).results[0]).toEqual({ premium: 71 });
      expect(processScenario(makeScenario("staff")).results[0]).toEqual({ premium: 93 });
      expect(processScenario(makeScenario("potion")).results[0]).toEqual({ premium: 49 });
    });
    it("should compute base premium for a single component", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      };

      const result = processScenario(scenario);

      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should apply block discount for 3 alike components (60G instead of 3x25G)", () => {
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

      const result = processScenario(scenario);

      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should sum premiums for multiple different items", () => {
      const scenario = {
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
      };

      const result = processScenario(scenario);

      expect(result.results[0]).toEqual({ premium: 181 });
    });
    it("should apply 50% cursed item surcharge", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      };

      const result = processScenario(scenario);

      expect(result.results[0]).toEqual({ premium: 170 });
    });
    it("should apply 30% surcharge for highly enchanted items (enchantment >= 5)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      };

      const result = processScenario(scenario);

      expect(result.results[0]).toEqual({ premium: 148 });
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };

      const result = processScenario(scenario);

      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should apply 15% repeat contract discount on second quote and omit first insurance surcharge", () => {
      const scenario = {
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
      };

      const result = processScenario(scenario);

      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 90 });
    });
    it("should round amounts in MHPCO's favor (ceiling)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      };

      const result = processScenario(scenario);

      // base 40, +10% first = ceil(44) = 44, -20% loyalty = ceil(35.2) = 36, +5 fee = 41
      expect(result.results[0]).toEqual({ premium: 41 });
    });
  });

  describe("Processing claims", () => {
    it("should apply 100G deductible per damage event", () => {
      const scenario = {
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
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      };

      const result = processScenario(scenario);

      expect(result.results[0]).toEqual({ premium: 71 });
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1000 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const scenario = {
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
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 800 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 600 }],
            },
          },
        ],
      };

      const result = processScenario(scenario);

      // Cap = 2 × 600 = 1200
      // Claim 1: payout = min(max(0, 800 - 100), 1200) = 700, remainingCap = 500
      // Claim 2: payout = min(max(0, 600 - 100), 500) = 500, remainingCap = 0
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 500 });
      expect(result.results[2]).toEqual({ payout: 500, remainingCap: 0 });
    });
    it("should reimburse 50% for items with enchantment level >= 8", () => {
      const scenario = {
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500, enchantment: 8 }],
            },
          },
        ],
      };

      const result = processScenario(scenario);

      // 50% reimbursement: 500 * 0.5 = 250
      // After deductible: max(0, 250 - 100) = 150
      // Cap = 2 × 1000 = 2000, payout = min(150, 2000) = 150
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
    it("should fully reimburse damage to dragon material items", () => {
      const scenario = {
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
              damages: [{ itemType: "sword", amount: 500, enchantment: 9, material: "dragon" }],
            },
          },
        ],
      };

      const result = processScenario(scenario);

      // Dragon material = full reimbursement (no 50% enchantment reduction)
      // Payout = min(max(0, 500 - 100), 2000) = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });
});
