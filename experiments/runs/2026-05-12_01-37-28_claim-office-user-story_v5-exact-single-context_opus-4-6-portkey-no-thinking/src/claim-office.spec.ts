import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should return base premium plus processing fee for a single sword", () => {
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
      // Base premium 100G, first-insurance surcharge 10% = 110G, + 5G fee = 115G
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should return correct base premium for each item type (amulet, staff, potion)", () => {
      const quote = (type: string) =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type, material: "silver", enchantment: 0, cursed: false }],
            },
          ],
        }).results[0];

      // Amulet: ceil(60 * 1.10) + 5 = 71
      expect(quote("amulet")).toEqual({ premium: 71 });
      // Staff: ceil(80 * 1.10) + 5 = 93
      expect(quote("staff")).toEqual({ premium: 93 });
      // Potion: ceil(40 * 1.10) + 5 = 49
      expect(quote("potion")).toEqual({ premium: 49 });
    });
    it("should return base premium of 25G for a single component", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "component", material: "moonstone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Component base premium 25G, first-insurance surcharge 10% = ceil(27.5) = 28, + 5G fee = 33G
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should charge 60G for a building block of 3 alike components", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "component", material: "moonstone", enchantment: 0, cursed: false },
              { type: "component", material: "moonstone", enchantment: 0, cursed: false },
              { type: "component", material: "moonstone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 3 alike components = building block, special base premium 60G
      // ceil(60 * 110 / 100) + 5 = 66 + 5 = 71G
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should sum premiums for multiple different items", () => {
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
      // Sword 100 + Amulet 60 = 160 base total
      // ceil(160 * 110 / 100) + 5 = 176 + 5 = 181G
      expect(result.results[0]).toEqual({ premium: 181 });
    });
    it("should add 50% surcharge for a cursed item", () => {
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
      // Sword base 100, cursed surcharge 50% = 150
      // ceil(150 * 110 / 100) + 5 = 165 + 5 = 170G
      expect(result.results[0]).toEqual({ premium: 170 });
    });
    it("should add 30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
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
      // Staff base 80, enchantment surcharge 30% = 104
      // ceil(104 * 110 / 100) + 5 = ceil(114.4) + 5 = 115 + 5 = 120G
      expect(result.results[0]).toEqual({ premium: 120 });
    });
    it("should apply both cursed and enchantment surcharges when both apply", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 6, cursed: true },
            ],
          },
        ],
      });
      // Amulet base 60, cursed 50% = 90, enchantment 30% = 117
      // ceil(117 * 110 / 100) + 5 = ceil(128.7) + 5 = 129 + 5 = 134G
      expect(result.results[0]).toEqual({ premium: 134 });
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Sword base 100, loyalty 20% off = 80, first insurance 10% = 88, + 5 fee = 93G
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should apply 10% initial assessment surcharge for a first insurance", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Potion base 40, loyalty 20% off = 32, first insurance 10% = ceil(35.2) = 36, + 5 = 41G
      expect(result.results[0]).toEqual({ premium: 41 });
    });
    it("should apply 15% discount on each contract after the first", () => {
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
      // First quote: Sword 100, first-insurance 10% = 110, + 5 = 115G
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: Sword 100, 15% discount = 85, + 5 = 90G
      expect(result.results[1]).toEqual({ premium: 90 });
    });
    it("should round premium in MHPCO's favor (ceiling)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // Amulet base 60, enchantment 30% = 78, loyalty 20% off = 62.4
      // first insurance 10% = 68.64, ceil = 69, + 5 = 74G
      // Without ceiling, floor(68.64) = 68 + 5 = 73 — ceiling rounds UP in MHPCO's favor
      expect(result.results[0]).toEqual({ premium: 74 });
    });
  });

  describe("Processing a claim", () => {
    it("should apply 100G deductible to a damage event", () => {
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
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false, damage: 250 },
            ],
          },
        ],
      });
      // Quote: 115G (as established)
      expect(result.results[0]).toEqual({ premium: 115 });
      // Claim: 250 damage - 100 deductible = 150 payout
      expect(result.results[1]).toEqual({ payout: 150 });
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
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false, damage: 500 },
            ],
          },
        ],
      });
      // Quote: 115G premium
      expect(result.results[0]).toEqual({ premium: 115 });
      // Claim: 500 damage - 100 deductible = 400, but capped at 2 * 115 = 230
      expect(result.results[1]).toEqual({ payout: 230 });
    });
    it("should reimburse damage to highly enchanted items (enchantment >= 8) at 50%", () => {
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
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false, damage: 300 },
            ],
          },
        ],
      });
      // Claim: 300 damage at 50% reimbursement = 150, minus 100 deductible = 50
      expect(result.results[1]).toEqual({ payout: 50 });
    });
    it("should fully reimburse damage to dragon material items", () => {
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
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false, damage: 200 },
            ],
          },
        ],
      });
      // Dragon material: full reimbursement (100%) despite enchantment 9
      // 200 damage at 100% = 200, minus 100 deductible = 100
      expect(result.results[1]).toEqual({ payout: 100 });
    });
    it("should track remaining cap across multiple claims on the same policy", () => {
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
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false, damage: 200 },
            ],
          },
          {
            op: "claim" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false, damage: 300 },
            ],
          },
        ],
      });
      // Premium: 115G, cap = 2 * 115 = 230
      // Claim 1: 200 - 100 deductible = 100 payout (remaining cap: 230 - 100 = 130)
      expect(result.results[1]).toEqual({ payout: 100 });
      // Claim 2: 300 - 100 deductible = 200, but remaining cap = 130
      expect(result.results[2]).toEqual({ payout: 130 });
    });
    it("should round payout in MHPCO's favor (floor)", () => {
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
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false, damage: 251 },
            ],
          },
        ],
      });
      // 251 damage at 50% reimbursement = 125.5, minus 100 deductible = 25.5
      // Floor rounds DOWN in MHPCO's favor = 25
      expect(result.results[1]).toEqual({ payout: 25 });
    });
  });
});
