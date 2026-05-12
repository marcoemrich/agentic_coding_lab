import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

function item(type: string, opts: { material?: string; enchantment?: number; cursed?: boolean } = {}) {
  return { type, material: opts.material ?? "steel", enchantment: opts.enchantment ?? 0, cursed: opts.cursed ?? false };
}

function quoteResult(items: any[], customer: { yearsWithMHPCO: number } = { yearsWithMHPCO: 0 }) {
  return processScenario({
    customer,
    steps: [{ op: "quote", items }],
  });
}

function claimResult(items: any[], damages: { itemType: string; amount: number }[], cause = "fire") {
  const result = processScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause, damages } },
    ],
  });
  return result.results[1];
}

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should return base premium plus processing fee for a single sword", () => {
      expect(quoteResult([item("sword")])).toEqual({ results: [{ premium: 115 }] });
    });
    it("should return correct base premium for each item type (amulet, staff, potion)", () => {
      expect(quoteResult([item("amulet")])).toEqual({ results: [{ premium: 71 }] });
      expect(quoteResult([item("staff")])).toEqual({ results: [{ premium: 93 }] });
      expect(quoteResult([item("potion")])).toEqual({ results: [{ premium: 49 }] });
    });
    it("should sum premiums for multiple different items", () => {
      expect(quoteResult([item("sword"), item("amulet")])).toEqual({ results: [{ premium: 181 }] });
    });
    it("should charge 25G base premium per component", () => {
      expect(quoteResult([item("rune"), item("rune")])).toEqual({ results: [{ premium: 60 }] });
    });
    it("should charge 60G for a building block of 3 alike components", () => {
      expect(quoteResult([item("rune"), item("rune"), item("rune")])).toEqual({ results: [{ premium: 71 }] });
    });
    it("should add 50% surcharge for cursed items", () => {
      expect(quoteResult([item("sword", { cursed: true })])).toEqual({ results: [{ premium: 170 }] });
    });
    it("should add 30% surcharge for highly enchanted items (enchantment >= 5)", () => {
      expect(quoteResult([item("amulet", { enchantment: 5 })])).toEqual({ results: [{ premium: 91 }] });
    });
    it("should apply both cursed and enchantment surcharges when both apply", () => {
      expect(quoteResult([item("staff", { cursed: true, enchantment: 6 })])).toEqual({ results: [{ premium: 177 }] });
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      expect(quoteResult([item("sword")], { yearsWithMHPCO: 3 })).toEqual({ results: [{ premium: 93 }] });
    });
    it("should add 10% surcharge on first contract and 15% discount on subsequent contracts", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [item("sword")] },
          { op: "quote", items: [item("amulet")] },
        ],
      });
      expect(result.results[0].premium).toBe(115);
      expect(result.results[1].premium).toBe(56);
    });
    it("should round amounts in MHPCO's favor", () => {
      // 4 runes: 1 block of 3 (60G) + 1 remainder (25G) = 85G base
      // First contract surcharge: ceil(85 * 10 / 100) = ceil(8.5) = 9
      // Premium = 94, + 5G fee = 99G
      expect(quoteResult([item("rune"), item("rune"), item("rune"), item("rune")])).toEqual({ results: [{ premium: 99 }] });
    });
  });

  describe("Processing a claim", () => {
    it("should apply 100G deductible per damage event", () => {
      expect(claimResult([item("sword")], [{ itemType: "sword", amount: 300 }]))
        .toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      // Potion: 400G insurance value, cap = 800G
      // Claim: 1000G damage - 100G deductible = 900G, but capped at 800G
      expect(claimResult([item("potion")], [{ itemType: "potion", amount: 1000 }]))
        .toEqual({ payout: 800, remainingCap: 0 });
    });
    it("should reimburse enchantment >= 8 items at 50% of damage amount", () => {
      // Amulet enchantment 9: insurance 600G, cap = 1200G
      // Claim: 400G damage, reimbursed at 50% = 200G, minus 100G deductible = 100G payout
      expect(claimResult([item("amulet", { enchantment: 9 })], [{ itemType: "amulet", amount: 400 }]))
        .toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("should fully reimburse damage to dragon material items", () => {
      // Dragon material sword with enchantment 9: dragon overrides enchantment reduction
      // Claim: 300G damage, fully reimbursed = 300G, minus 100G deductible = 200G payout
      // Sword insurance = 1000G, cap = 2000G, remainingCap = 1800G
      expect(claimResult(
        [item("sword", { material: "dragon", enchantment: 9 })],
        [{ itemType: "sword", amount: 300 }]
      )).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should track remaining cap across multiple claims on the same policy", () => {
      // Sword: 1000G insurance, cap = 2000G
      // Claim 1: 1500G damage - 100G deductible = 1400G payout, remainingCap = 600
      // Claim 2: 800G damage - 100G deductible = 700G, capped at 600, remainingCap = 0
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [item("sword")] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "sword", amount: 800 }] } },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });
});
