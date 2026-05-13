import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - main items", () => {
    it("should quote a single sword for a new customer", () => {
      const result = processScenario({
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
      // Base premium: 100, first insurance +10% = 110, +5G fee = 115
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should quote a single amulet for a new customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Base premium: 60, first insurance +10% = 66, +5G fee = 71
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should quote a single staff for a new customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Base premium: 80, first insurance +10% = 88, +5G fee = 93
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("should quote a single potion for a new customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Base premium: 40, first insurance +10% = 44, +5G fee = 49
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("should sum base premiums for multiple main items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Sword 100 + Amulet 60 = 160 base, +10% first = 176, +5 = 181
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
  });

  describe("Quote - components", () => {
    it("should charge 25G base premium for a single component", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false, component: true },
            ],
          },
        ],
      });
      // Component base: 25, +10% first = 27.5 → ceil 28, +5 = 33
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("should charge 60G for a building block of 3 alike components", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false, component: true },
              { type: "rune", material: "stone", enchantment: 0, cursed: false, component: true },
              { type: "rune", material: "stone", enchantment: 0, cursed: false, component: true },
            ],
          },
        ],
      });
      // 3 alike runes = 60G block (not 75G), +10% first = 66, +5 = 71
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should charge per-component for non-block remainders", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false, component: true },
              { type: "rune", material: "stone", enchantment: 0, cursed: false, component: true },
              { type: "rune", material: "stone", enchantment: 0, cursed: false, component: true },
              { type: "rune", material: "stone", enchantment: 0, cursed: false, component: true },
            ],
          },
        ],
      });
      // 4 runes = 1 block (60) + 1 single (25) = 85, +10% = 93.5 → 94, +5 = 99
      expect(result).toEqual({ results: [{ premium: 99 }] });
    });
  });

  describe("Quote - surcharges and discounts", () => {
    it("should add 50% surcharge for cursed items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      // Sword 100, cursed +50% = 150, first +10% = 165, +5 = 170
      expect(result).toEqual({ results: [{ premium: 170 }] });
    });
    it("should add 30% surcharge for items with enchantment >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // Sword 100, ench +30% = 130, first +10% = 143, +5 = 148
      expect(result).toEqual({ results: [{ premium: 148 }] });
    });
    it("should apply 20% loyalty discount for customers with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Sword 100, loyalty -20% = 80, first +10% = 88, +5 = 93
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("should add 10% initial assessment surcharge on first insurance", () => {
      // Implicitly tested by the sword/amulet tests above; this asserts the value alone.
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Potion 40, first +10% = 44, +5 = 49
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("should apply 15% discount on each contract after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      });
      // 1st: 100 * 1.10 + 5 = 115
      // 2nd: 100 * 0.85 + 5 = 90
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
    });
    it("should add 5G processing fee to every premium", () => {
      // A second contract with no insurance (empty items) still gets 5G fee.
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "quote",
            items: [],
          },
        ],
      });
      // 1st: 115, 2nd: 0 base * 0.85 + 5 = 5
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 5 }] });
    });
    it("should round premium up in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // Amulet 60, ench +30% = 78, first +10% = 85.8 → ceil 86, +5 = 91
      expect(result).toEqual({ results: [{ premium: 91 }] });
    });
  });

  describe("Claim", () => {
    it("should subtract 100G deductible from damage amount", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      });
      // Quote: 60 * 0.8 = 48, * 1.10 = 52.8 → ceil 53, +5 = 58
      // Claim: 300 - 100 deductible = 200 payout
      // Cap: 2 * 600 = 1200, remaining after this claim = 1200 - 200 = 1000
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1000 });
    });
    it("should cap total payout at 2x the insurance sum of the policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 5000 }],
            },
          },
        ],
      });
      // Damage 5000 - 100 = 4900 wanted; cap = 2 * 600 = 1200; payout = 1200
      expect(result.results[1]).toEqual({ payout: 1200, remainingCap: 0 });
    });
    it("should reimburse 50% for damage to items with enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fall",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });
      // Sword ench 8: reimbursement = 400 * 0.5 = 200, - 100 deductible = 100
      // Cap = 2 * 1000 = 2000, remaining = 1900
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("should fully reimburse damage to items made of dragon material", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "battle",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });
      // Dragon material overrides ench≥8: full 400 reimbursement - 100 deductible = 300
      expect(result.results[1]).toEqual({ payout: 300, remainingCap: 1700 });
    });
    it("should track remaining cap across multiple claims", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "spell", damages: [{ itemType: "amulet", amount: 400 }] },
          },
        ],
      });
      // Cap 1200. First claim: 300 - 100 = 200, remaining 1000.
      // Second claim: 400 - 100 = 300, remaining 700.
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1000 });
      expect(result.results[2]).toEqual({ payout: 300, remainingCap: 700 });
    });
  });
});
