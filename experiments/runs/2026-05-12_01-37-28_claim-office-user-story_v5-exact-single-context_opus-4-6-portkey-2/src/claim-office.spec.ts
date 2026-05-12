import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

function quoteOne(
  type: string,
  options: { material?: string; enchantment?: number; cursed?: boolean; yearsWithMHPCO?: number } = {},
) {
  const { material = "steel", enchantment = 0, cursed = false, yearsWithMHPCO = 0 } = options;
  const result = processScenario({
    customer: { yearsWithMHPCO },
    steps: [
      {
        op: "quote",
        items: [{ type, material, enchantment, cursed }],
      },
    ],
  });
  return result.results[0];
}

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should calculate base premium for a single sword with processing fee", () => {
      // Sword base premium: 100G
      // First insurance surcharge (+10%): +10G = 110G
      // Processing fee: +5G = 115G
      expect(quoteOne("sword")).toEqual({ premium: 115 });
    });
    it("should calculate base premium for each item type (amulet, staff, potion)", () => {
      expect(quoteOne("amulet")).toEqual({ premium: 71 });
      expect(quoteOne("staff")).toEqual({ premium: 93 });
      expect(quoteOne("potion")).toEqual({ premium: 49 });
    });
    it("should calculate base premium for a single component", () => {
      // Component base premium: 25G * 1.1 = 27.5 → round = 28G + 5G = 33G
      expect(quoteOne("rune")).toEqual({ premium: 33 });
    });
    it("should sum premiums for multiple items", () => {
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
      // Sword base: 100G + Amulet base: 60G = 160G
      // First insurance surcharge (+10%): 160 * 1.1 = 176G
      // Processing fee: +5G = 181G
      expect(result.results[0]).toEqual({ premium: 181 });
    });
    it("should apply building block discount for 3 alike components", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 3 alike components = building block: 60G base (instead of 3 × 25 = 75G)
      // First insurance surcharge (+10%): 60 * 1.1 = 66G
      // Processing fee: +5G = 71G
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should add 50% surcharge for cursed items", () => {
      // Sword base: 100G, cursed surcharge (+50%): 150G
      // First insurance surcharge (+10%): 150 * 1.1 = 165G
      // Processing fee: +5G = 170G
      expect(quoteOne("sword", { cursed: true })).toEqual({ premium: 170 });
    });
    it("should add 30% surcharge for highly enchanted items (enchantment >= 5)", () => {
      // Amulet base: 60G, enchantment surcharge (+30%): 60 * 1.3 = 78G
      // First insurance surcharge (+10%): 78 * 1.1 = 85.8 → round = 86G
      // Processing fee: +5G = 91G
      expect(quoteOne("amulet", { enchantment: 5 })).toEqual({ premium: 91 });
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      // Sword base: 100G, loyalty discount (-20%): 100 * 0.80 = 80G
      // No first insurance surcharge for existing customers
      // Processing fee: +5G = 85G
      expect(quoteOne("sword", { yearsWithMHPCO: 3 })).toEqual({ premium: 85 });
    });
    it("should apply 10% first insurance surcharge for new customers", () => {
      // New customer (yearsWithMHPCO: 1, less than 2 years)
      // Sword base: 100G, first insurance surcharge (+10%): 100 * 1.1 = 110G
      // Processing fee: +5G = 115G
      expect(quoteOne("sword", { yearsWithMHPCO: 1 })).toEqual({ premium: 115 });
    });
    it("should apply 15% discount on contracts after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ],
      });
      // Step 1 (first contract): 100 * 1.1 = 110, round = 110, + 5 = 115G
      // Step 2 (second contract, -15%): 100 * 1.1 * 0.85 = 93.5, round = 94, + 5 = 99G
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 99 });
    });
    it("should round premium amounts in MHPCO's favor", () => {
      // Multi-contract amulet: amulet base 60G * 1.1 (first insurance) * 0.85 (multi-contract) = 56.1G
      // Rounding in MHPCO's favor (ceil): 57G + 5G processing = 62G
      // Current Math.round would give: 56G + 5G = 61G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 62 });
    });
  });

  describe("Processing a claim", () => {
    it("should apply 100G deductible per damage event", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            damageEvents: [{ amount: 300 }],
          },
        ],
      });
      // Damage: 300G - 100G deductible = 200G payout
      expect(result.results[1]).toEqual({ payout: 200 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            damageEvents: [{ amount: 300 }],
          },
        ],
      });
      // Potion premium: 49G, cap = 2 × 49 = 98G
      // Damage: 300G - 100G deductible = 200G, but capped at 98G
      expect(result.results[1]).toEqual({ payout: 98 });
    });
    it("should reimburse highly enchanted items (enchantment >= 8) at 50%", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            damageEvents: [{ amount: 400, enchantment: 8 }],
          },
        ],
      });
      // Highly enchanted (enchantment >= 8): reimbursed at 50% of damage
      // Reimbursable: 400 * 0.5 = 200G, minus 100G deductible = 100G payout
      // Sword premium: 115G, cap = 230G, so 100G is within cap
      expect(result.results[1]).toEqual({ payout: 100 });
    });
    it("should fully reimburse damage to dragon material items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            damageEvents: [{ amount: 200, material: "dragon" }],
          },
        ],
      });
      // Dragon material: fully reimbursed (no deductible)
      // Payout: 200G (full amount, within cap of 230G)
      expect(result.results[1]).toEqual({ payout: 200 });
    });
    it("should track remaining cap across multiple claims on same policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "claim",
            damageEvents: [{ amount: 250 }],
          },
          {
            op: "claim",
            damageEvents: [{ amount: 250 }],
          },
        ],
      });
      // Sword premium: 115G, cap = 2 × 115 = 230G
      // Claim 1: 250 - 100 deductible = 150G payout, remaining cap = 80G
      // Claim 2: 250 - 100 deductible = 150G, but capped at remaining 80G
      expect(result.results[1]).toEqual({ payout: 150 });
      expect(result.results[2]).toEqual({ payout: 80 });
    });
  });
});
