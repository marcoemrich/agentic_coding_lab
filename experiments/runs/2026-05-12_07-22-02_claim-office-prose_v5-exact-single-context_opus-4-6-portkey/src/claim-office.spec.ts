import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting premiums", () => {
    it("should compute premium for a single sword for a new customer", () => {
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
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should compute premium for other item types (amulet, staff, potion)", () => {
      const amuletResult = processScenario({
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
      expect(amuletResult.results[0]).toEqual({ premium: 71 });

      const staffResult = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "oak", enchantment: 1, cursed: false },
            ],
          },
        ],
      });
      expect(staffResult.results[0]).toEqual({ premium: 93 });

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
      expect(potionResult.results[0]).toEqual({ premium: 49 });
    });
    it("should sum premiums for multiple items", () => {
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
      expect(result.results[0]).toEqual({ premium: 181 });
    });
    it("should compute premium for a single component", () => {
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
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should apply bundle pricing for 3 alike components", () => {
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
      expect(result.results[0]).toEqual({ premium: 170 });
    });
    it("should add 30% surcharge for highly enchanted items (enchantment >= 5)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "oak", enchantment: 6, cursed: false },
            ],
          },
        ],
      });
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
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should apply 15% discount on second contract and no first-insurance surcharge", () => {
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
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 90 });
    });
    it("should round amounts up in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: true },
            ],
          },
        ],
      });
      // amulet base 60, cursed *1.5=90, first insurance *1.1=99, loyalty *0.8=79.2
      // ceil(79.2)=80, +5 processing = 85
      expect(result.results[0]).toEqual({ premium: 85 });
    });
  });

  describe("Processing claims", () => {
    it("should apply 100G deductible to a basic claim", () => {
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
              damages: [
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1000 });
    });
    it("should reimburse high-enchantment items (>= 8) at 50%", () => {
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
              cause: "magical_overload",
              damages: [
                { itemType: "sword", amount: 400, enchantment: 9, material: "steel" },
              ],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("should fully reimburse dragon material items", () => {
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
              cause: "battle",
              damages: [
                { itemType: "sword", amount: 400, enchantment: 9, material: "dragon" },
              ],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 300, remainingCap: 1700 });
    });
    it("should cap total payout at twice the insurance sum", () => {
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
              damages: [
                { itemType: "potion", amount: 500, enchantment: 0, material: "glass" },
              ],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "flood",
              damages: [
                { itemType: "potion", amount: 600, enchantment: 0, material: "glass" },
              ],
            },
          },
        ],
      });
      // potion insurance = 400, cap = 800
      // claim 1: 500 - 100 deductible = 400, remainingCap = 400
      // claim 2: 600 - 100 deductible = 500, capped at 400, remainingCap = 0
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 400 });
      expect(result.results[2]).toEqual({ payout: 400, remainingCap: 0 });
    });
  });
});
